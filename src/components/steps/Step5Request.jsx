import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { generateRequest, generateInfoPanel, generateStructuredData } from '../../utils/generate.js';
import { TYPE_LABEL } from '../../data/keywords.js';

export default function Step5Request({ ctype, inputText, ext, answers, urgency, onBack, onReset }) {
  const info        = generateInfoPanel({ type: ctype, ext, answers, urgency });
  const initialText = generateRequest({ type: ctype, ext, answers, urgency });

  const [editMode, setEditMode]     = useState(false);
  const [editedText, setEditedText] = useState(initialText);
  const [copied, setCopied]         = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const isEdited    = editedText !== initialText;
  const displayText = editedText;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(displayText); }
    catch (_) {
      const el = document.createElement('textarea');
      el.value = displayText; document.body.appendChild(el);
      el.select(); document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([displayText], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `계약검토요청_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click(); URL.revokeObjectURL(url);
    setDownloaded(true); setTimeout(() => setDownloaded(false), 2000);
  };

  const handleDownloadJson = () => {
    const data = generateStructuredData({ type: ctype, inputText, ext, answers });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `계약검토요청_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in">

      {/* 헤더 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>계약검토 요청서</h2>
        <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-secondary)' }}>
          기본정보는 법무시스템에 직접 입력하고, 아래 요청서 텍스트만 복사해 제출하세요.
        </p>
      </div>

      {/* ── 기본정보 패널 — 법무시스템 5개 항목만 ── */}
      <div style={{
        background: 'var(--bg-muted)',
        border: '0.5px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '1.25rem',
      }}>
        {/* 레이블 */}
        <div style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
          color: 'var(--text-tertiary)', marginBottom: '14px', textTransform: 'uppercase',
        }}>
          기본정보 — 법무시스템 직접 입력용 (복사 영역 아님)
        </div>

        {/* 유형 + 긴급도 배지 */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <Badge variant="default">{info.label}</Badge>
          <Badge variant={
            info.urgencyLabel.includes('긴급') ? 'danger' :
            info.urgencyLabel.includes('일반') ? 'success' : 'default'
          }>
            긴급도: {info.urgencyLabel}
          </Badge>
        </div>

        {/* 5개 핵심 필드 — 2열 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '10px 24px',
        }}>
          {info.fields.map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>
                {f.label}
              </div>
              <div style={{
                fontSize: '13px', fontWeight: 600,
                color: f.value === '미정' ? 'var(--text-tertiary)' : 'var(--text-primary)',
              }}>
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 복사용 요청서 영역 ── */}
      <div style={{
        border: '1.5px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {/* 복사 영역 헤더 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'var(--bg-surface)',
          borderBottom: '0.5px solid var(--border-default)',
          flexWrap: 'wrap', gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>복사할 요청서 내용</span>
            <Badge variant="info">계약 배경 · 기본내용 · 검토 요청사항</Badge>
            {isEdited && <Badge variant="warn">수정됨</Badge>}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setEditMode(m => !m)}
              style={{
                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                border: `0.5px solid ${editMode ? 'var(--accent)' : 'var(--border-medium)'}`,
                background: editMode ? 'var(--accent)' : 'transparent',
                color: editMode ? 'var(--text-inverted)' : 'var(--text-secondary)',
              }}
            >
              {editMode ? '편집 중' : '편집'}
            </button>
            {isEdited && (
              <button
                onClick={() => setEditedText(initialText)}
                style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-md)',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                  border: '0.5px solid var(--warn-border)',
                  background: 'var(--warn-bg)', color: 'var(--warn-text)',
                }}
              >
                원본 복원
              </button>
            )}
            <Button variant="outline" onClick={handleDownloadJson}>JSON</Button>
            <Button variant="outline" onClick={handleDownloadTxt}>{downloaded ? '저장됨!' : 'TXT'}</Button>
            <Button variant="primary" onClick={handleCopy}>{copied ? '복사됨 ✓' : '복사'}</Button>
          </div>
        </div>

        {/* 요청서 본문 */}
        {editMode ? (
          <textarea
            value={editedText}
            onChange={e => setEditedText(e.target.value)}
            style={{
              width: '100%', minHeight: '520px', padding: '16px',
              border: 'none', outline: 'none',
              fontSize: '13px', lineHeight: 1.8,
              background: 'var(--bg-surface)', color: 'var(--text-primary)',
              fontFamily: "'JetBrains Mono', monospace",
              resize: 'vertical', boxSizing: 'border-box', display: 'block',
            }}
          />
        ) : (
          <div style={{
            padding: '16px', minHeight: '520px',
            fontSize: '13px', lineHeight: 1.9,
            background: 'var(--bg-surface)', color: 'var(--text-primary)',
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'pre-wrap',
          }}>
            {displayText.split('\n').map((line, i) => {
              const isSectionHeader = /^━━/.test(line);
              const isTopLine       = i === 0;
              const isDivider       = /^┈+$/.test(line.trim());
              const isWarning       = line.startsWith('⚠');
              const isRisk          = line.startsWith('[리스크');
              const isNumbered      = /^\d+\./.test(line.trim());
              return (
                <div key={i} style={{
                  fontWeight: isSectionHeader || isTopLine ? 700 : isNumbered ? 500 : 400,
                  color: isWarning ? 'var(--warn-text)'
                       : isRisk    ? 'var(--danger-text)'
                       : isDivider ? 'var(--text-tertiary)'
                       : 'inherit',
                  marginTop:    isSectionHeader ? '10px' : 0,
                  marginBottom: isSectionHeader ? '4px'  : 0,
                  paddingLeft:  isSectionHeader ? 0 : undefined,
                }}>
                  {line || '\u00A0'}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="outline" onClick={onBack}>← 뒤로</Button>
        <Button variant="ghost" onClick={onReset}>+ 새 요청서 작성</Button>
      </div>

    </div>
  );
}
