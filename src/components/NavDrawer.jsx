import { TYPE_LABEL } from '../data/keywords.js';

const NAV_ITEMS = [
  { icon: '▸', label: '새 요청서 작성',    action: 'new'     },
  { icon: '◈', label: 'NDA',               action: 'NDA'     },
  { icon: '◈', label: '공급계약',            action: 'SUPPLY'  },
  { icon: '◈', label: '용역계약',            action: 'SERVICE' },
  { icon: '◈', label: '공동개발계약',        action: 'JOINT_DEV' },
  { icon: '◈', label: '라이선스계약',        action: 'LICENSE' },
  { icon: '◈', label: '위수탁계약',          action: 'CONSIGNMENT' },
  { icon: '◈', label: '기타',               action: 'OTHER'   },
];

export default function NavDrawer({ open, onClose, onSelect, onNew }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.25)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      />

      {/* Drawer */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '260px', zIndex: 201,
        background: 'var(--bg-surface)',
        borderRight: '0.5px solid var(--border-default)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.22s ease',
        display: 'flex', flexDirection: 'column',
        boxShadow: open ? '4px 0 24px rgba(0,0,0,0.10)' : 'none',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '0.5px solid var(--border-default)',
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Contract Intake Navigator</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>계약 검토 요청 도우미</div>
          </div>
          <button
            onClick={onClose}
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

        {/* Nav body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
          {/* New request button */}
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

          {/* Section: 유형 바로 선택 */}
          <div style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
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
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: 'var(--border-strong)', flexShrink: 0,
              }} />
              {label}
            </button>
          ))}

          {/* Divider */}
          <div style={{
            margin: '1rem 1.25rem',
            borderTop: '0.5px solid var(--border-default)',
          }} />

          {/* Section: Links */}
          <div style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
            color: 'var(--text-tertiary)', textTransform: 'uppercase',
            padding: '0 1.25rem', marginBottom: '6px',
          }}>
            관련 링크
          </div>

          {[
            ['SharePoint 법무 포털', '#'],
            ['표준계약서 라이브러리', '#'],
            ['법무팀 연락처', '#'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
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
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.875rem 1.25rem',
          borderTop: '0.5px solid var(--border-default)',
          fontSize: '11px', color: 'var(--text-tertiary)',
        }}>
          Contract Intake Navigator v1.0
        </div>
      </nav>
    </>
  );
}
