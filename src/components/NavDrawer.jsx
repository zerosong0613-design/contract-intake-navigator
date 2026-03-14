import { TYPE_LABEL } from '../data/keywords.js';

// 환경변수 미설정 시 링크 항목을 자동으로 숨깁니다.
const NAV_LINKS = [
  { label: 'SharePoint 법무 포털',   href: import.meta.env.VITE_LEGAL_PORTAL_URL },
  { label: '표준계약서 라이브러리',   href: import.meta.env.VITE_TEMPLATE_LIBRARY_URL },
  { label: '법무팀 연락처',           href: import.meta.env.VITE_LEGAL_CONTACT_URL },
].filter(l => l.href && l.href !== 'undefined');

export default function NavDrawer({ open, onClose, onSelect, onNew }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.25)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      />

      {/* Drawer */}
      <nav
        aria-label="메인 내비게이션"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '260px', zIndex: 201,
          background: 'var(--bg-surface)',
          borderRight: '0.5px solid var(--border-default)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.22s ease',
          display: 'flex', flexDirection: 'column',
          boxShadow: open ? '4px 0 24px rgba(0,0,0,0.10)' : 'none',
        }}
      >
        {/* 헤더 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '0.5px solid var(--border-default)',
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Contract Intake Navigator</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>계약 검토 요청 도우미</div>
          </div>
          <button
            onClick={onClose}
            aria-label="메뉴 닫기"
            style={{
              width: '28px', height: '28px', borderRadius: 'var(--radius-sm)',
              border: 'none', background: 'var(--bg-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', color: 'var(--text-secondary)',
            }}
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
          {/* 새 요청서 */}
          <div style={{ padding: '0 0.875rem', marginBottom: '1rem' }}>
            <button
              onClick={() => { onNew(); onClose(); }}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent)', color: 'var(--text-inverted)',
                border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>+</span> 새 요청서 작성
            </button>
          </div>

          {/* 유형 바로 선택 */}
          <div style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
            color: 'var(--text-tertiary)', textTransform: 'uppercase',
            padding: '0 1.25rem', marginBottom: '6px',
          }}>
            계약 유형 바로 선택
          </div>

          {Object.entries(TYPE_LABEL).map(([code, label]) => (
            <button
              key={code}
              onClick={() => { onSelect(code); onClose(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '9px 1.25rem',
                border: 'none', background: 'transparent',
                cursor: 'pointer', textAlign: 'left',
                fontSize: '13px', color: 'var(--text-primary)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--border-strong)', flexShrink: 0 }} />
              {label}
            </button>
          ))}

          {/* 관련 링크 — 환경변수 설정된 항목만 표시 */}
          {NAV_LINKS.length > 0 && (
            <>
              <div style={{ margin: '1rem 1.25rem', borderTop: '0.5px solid var(--border-default)' }} />
              <div style={{
                fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
                color: 'var(--text-tertiary)', textTransform: 'uppercase',
                padding: '0 1.25rem', marginBottom: '6px',
              }}>
                관련 링크
              </div>
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 1.25rem',
                    fontSize: '13px', color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <span style={{ fontSize: '11px' }}>↗</span>
                  {label}
                </a>
              ))}
            </>
          )}
        </div>

        {/* 푸터 */}
        <div style={{
          padding: '0.875rem 1.25rem',
          borderTop: '0.5px solid var(--border-default)',
          fontSize: '12px', color: 'var(--text-tertiary)',
        }}>
          Contract Intake Navigator v1.1
        </div>
      </nav>
    </>
  );
}
