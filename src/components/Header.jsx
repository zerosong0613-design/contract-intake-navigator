const STEPS = ['입력', '분석', '보완', '계약서', '요청서'];

export default function Header({ step, onStepClick, useAI, onToggleAI, onMenuClick, onSettingsClick, hasApiKey }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.875rem 1.5rem',
      background: 'var(--bg-surface)',
      borderBottom: '0.5px solid var(--border-default)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onMenuClick}
          title="메뉴"
          style={{
            width: '32px', height: '32px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '4px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderRadius: 'var(--radius-sm)', padding: '4px',
            flexShrink: 0,
          }}
        >
          <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'var(--text-primary)', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'var(--text-primary)', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '12px', height: '1.5px', background: 'var(--text-primary)', borderRadius: '1px', alignSelf: 'flex-start' }} />
        </button>
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

        {/* Settings button */}
        <button
          onClick={onSettingsClick}
          title="API 키 설정"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 11px', borderRadius: '20px', cursor: 'pointer',
            background: 'var(--bg-muted)',
            border: `0.5px solid ${hasApiKey ? 'var(--success-border)' : 'var(--border-default)'}`,
            color: hasApiKey ? 'var(--success-text)' : 'var(--text-secondary)',
            fontSize: '11px', fontWeight: 500,
          }}
        >
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
            background: hasApiKey ? 'var(--success-text)' : 'var(--border-strong)',
          }} />
          {hasApiKey ? 'API 연결됨' : 'API 키 설정'}
        </button>

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
