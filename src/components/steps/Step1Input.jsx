import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { TYPE_LABEL, ALL_TYPES } from '../../data/keywords.js';

export default function Step1Input({ onAnalyze, onManual, useAI, analyzing, error }) {
  const [text, setText] = useState('');
  const [tab, setTab] = useState('free'); // 'free' | 'paste'

  const canSubmit = text.trim().length >= 8 && !analyzing;

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
          어떤 거래를 준비 중이신가요?
        </h2>
        <p style={{ fontSize: '13px' }}>
          거래 상황을 자유롭게 설명하거나, 상대방 계약서 초안을 붙여넣으세요.
        </p>
      </div>

      {/* Tab */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {[['free', '자유 입력'], ['paste', '계약서 붙여넣기']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '5px 14px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 500,
            border: '0.5px solid',
            borderColor: tab === t ? 'var(--border-strong)' : 'var(--border-default)',
            background: tab === t ? 'var(--accent)' : 'transparent',
            color: tab === t ? 'var(--text-inverted)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}>
            {l}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={tab === 'free'
          ? '예시:\n· 중국 업체와 기술협력 논의를 위해 자료를 주고받으려 합니다.\n· 외주 개발 계약을 하려는데 결과물은 당사 귀속으로 하고 싶습니다.\n· 상대방이 보낸 공급계약서 초안 검토를 요청하려고 합니다.'
          : '상대방이 보낸 계약서 전문을 여기에 붙여넣으세요.\n시스템이 주요 조항을 자동으로 추출합니다.'}
        style={{
          width: '100%', minHeight: tab === 'paste' ? '240px' : '140px',
          padding: '12px 14px',
          border: '0.5px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px', lineHeight: 1.7,
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          resize: 'vertical', boxSizing: 'border-box',
        }}
      />

      {error && (
        <div style={{ marginTop: '8px' }}>
          <Badge variant="warn">{error}</Badge>
        </div>
      )}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '1rem',
      }}>
        <Button
          variant="primary"
          onClick={() => onAnalyze(text)}
          disabled={!canSubmit}
        >
          {analyzing
            ? '분석 중…'
            : useAI ? '▸  AI로 분석 시작' : '▸  분석 시작'}
        </Button>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
          또는 아래에서 유형 직접 선택
        </span>
      </div>

      {/* Manual type selection */}
      <div style={{
        marginTop: '1.75rem', paddingTop: '1.5rem',
        borderTop: '0.5px solid var(--border-default)',
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 500 }}>
          계약 유형 직접 선택
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
          gap: '7px',
        }}>
          {ALL_TYPES.map(t => (
            <button key={t} onClick={() => onManual(t)} style={{
              padding: '10px 14px', borderRadius: 'var(--radius-md)',
              fontSize: '12px', fontWeight: 500, textAlign: 'left',
              border: '0.5px solid var(--border-default)',
              background: 'var(--bg-muted)',
              color: 'var(--text-primary)', cursor: 'pointer',
              transition: 'border-color 0.12s, background 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-muted)'; }}
            >
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
