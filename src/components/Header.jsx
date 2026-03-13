const STEPS = ['입력', '분석', '보완', '계약서', '요청서'];

export default function Header({ step, onStepClick, useAI, onToggleAI }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.875rem 1.5rem',
      background: 'var(--bg-surface)',
      borderBottom: '0.5px solid var(--border-default)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="var(--accent)" />
          <path d="M6 7h12M6 11h9M6 15h10M6 19h7" stroke="var(--text-inverted)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Contract Intake Navigator
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            계약 검토 요청 도우미
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {STEPS.map((label, i) => {
            const n = i + 1;
            const isCurrent = step === n;
            const isDone = step > n;
            return (
              <button
                key={n}
                onClick={() => isDone && onStepClick(n)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 10px', borderRadius: '20px',
                  fontSize: '11px', fontWeight: 500,
                  border: 'none', cursor: isDone ? 'pointer' : 'default',
                  background: isCurrent ? 'var(--accent)' : 'transparent',
                  color: isCurrent ? 'var(--text-inverted)'
                    : isDone ? 'var(--success-text)' : 'var(--text-tertiary)',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 600,
                  background: isCurrent ? 'rgba(255,255,255,0.2)'
                    : isDone ? 'var(--success-bg)' : 'var(--bg-muted)',
                  color: isCurrent ? 'var(--text-inverted)'
                    : isDone ? 'var(--success-text)' : 'var(--text-tertiary)',
                }}>
                  {isDone ? '✓' : n}
                </span>
                <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>{label}</span>
              </button>
            );
          })}
        </div>

        {/* AI toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '5px 12px',
          background: 'var(--bg-muted)',
          border: '0.5px solid var(--border-default)',
          borderRadius: '20px',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>AI</span>
          <button
            onClick={onToggleAI}
            title={useAI ? 'Claude API 분석 (끄려면 클릭)' : '규칙 기반 분석 (켜려면 클릭)'}
            style={{
              width: '36px', height: '20px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', position: 'relative',
              background: useAI ? 'var(--accent)' : 'var(--border-medium)',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: 'var(--bg-surface)',
              position: 'absolute', top: '3px',
              left: useAI ? '19px' : '3px',
              transition: 'left 0.18s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }} />
          </button>
          <span style={{
            fontSize: '11px', fontWeight: 500,
            color: useAI ? 'var(--success-text)' : 'var(--text-tertiary)',
            minWidth: '40px',
          }}>
            {useAI ? 'Claude' : '규칙'}
          </span>
        </div>
      </div>
    </header>
  );
}
