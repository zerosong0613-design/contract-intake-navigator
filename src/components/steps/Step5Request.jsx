import { useState } from 'react';
import Button from '../ui/Button.jsx';
import { generateStructuredData } from '../../utils/generate.js';
import { TYPE_LABEL } from '../../data/keywords.js';

export default function Step5Request({ reqText: initialText, ctype, inputText, ext, answers, onBack, onReset }) {
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const isEdited = editedText !== initialText;
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `계약검토요청서_${new Date().toISOString().slice(0,10)}.txt`;
    a.click(); URL.revokeObjectURL(url);
    setDownloaded(true); setTimeout(() => setDownloaded(false), 2000);
  };

  const handleDownloadJson = () => {
    const data = generateStructuredData({ type: ctype, inputText, ext, answers });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `계약검토요청_data_${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleResetEdit = () => setEditedText(initialText);

  return (
    <div className="animate-in">
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '3px' }}>계약검토 요청서</h2>
          <p style={{ fontSize: '13px', margin: 0 }}>
            {TYPE_LABEL[ctype]} — 법무팀 제출용 요청서
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* 편집/미리보기 토글 */}
          <button
            onClick={() => setEditMode(m => !m)}
            style={{
              padding: '7px 13px', borderRadius: 'var(--radius-md)',
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
              onClick={handleResetEdit}
              style={{
                padding: '7px 13px', borderRadius: 'var(--radius-md)',
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

      {/* 수정됨 배지 */}
      {isEdited && (
        <div style={{
          background: 'var(--warn-bg)', border: '0.5px solid var(--warn-border)',
          borderRadius: 'var(--radius-md)', padding: '8px 14px',
          fontSize: '12px', color: 'var(--warn-text)', marginBottom: '10px',
        }}>
          내용이 수정되었습니다. 복사/저장 시 수정된 내용이 반영됩니다.
        </div>
      )}

      {/* 안내 */}
      {!isEdited && (
        <div style={{
          background: 'var(--success-bg)', border: '0.5px solid var(--success-border)',
          borderRadius: 'var(--radius-md)', padding: '8px 14px',
          fontSize: '12px', color: 'var(--success-text)', marginBottom: '10px',
        }}>
          복사하여 사내 포털 또는 담당자에게 전달하세요. JSON 저장은 SharePoint 연동 시 활용합니다.
        </div>
      )}

      {/* 편집 모드: textarea / 미리보기: 읽기 전용 렌더링 */}
      {editMode ? (
        <textarea
          value={editedText}
          onChange={e => setEditedText(e.target.value)}
          style={{
            width: '100%', minHeight: '480px', padding: '16px',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px', lineHeight: 1.75,
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontFamily: "'JetBrains Mono', monospace",
            resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      ) : (
        <div style={{
          width: '100%', minHeight: '480px', padding: '16px',
          border: '0.5px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px', lineHeight: 1.9,
          background: 'var(--bg-muted)',
          color: 'var(--text-primary)',
          fontFamily: "'JetBrains Mono', monospace",
          whiteSpace: 'pre-wrap', overflowX: 'auto',
          boxSizing: 'border-box',
        }}>
          {displayText.split('\n').map((line, i) => {
            // 섹션 번호 줄(1. 2. …) 강조
            const isSection = /^\d+\./.test(line.trim());
            // 구분선 강조
            const isDivider = /^─+$/.test(line.trim());
            // [주의] 줄 강조
            const isRisk = line.includes('[주의]');
            return (
              <div key={i} style={{
                fontWeight: isSection ? 600 : 400,
                color: isRisk ? 'var(--danger-text)' : isDivider ? 'var(--border-strong)' : 'inherit',
                marginBottom: isSection ? '2px' : isDivider ? '4px' : '0',
              }}>
                {line || '\u00A0'}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="outline" onClick={onBack}>← 뒤로</Button>
        <Button variant="ghost" onClick={onReset}>+ 새 요청서 작성</Button>
      </div>
    </div>
  );
}
