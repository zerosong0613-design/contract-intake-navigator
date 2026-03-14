const COLORS = {
  success: { bg: 'var(--success-bg)', color: 'var(--success-text)', border: 'var(--success-border)' },
  warn:    { bg: 'var(--warn-bg)',    color: 'var(--warn-text)',    border: 'var(--warn-border)'    },
  danger:  { bg: 'var(--danger-bg)', color: 'var(--danger-text)', border: 'var(--danger-border)'  },
  info:    { bg: 'var(--info-bg)',   color: 'var(--info-text)',   border: 'var(--info-border)'    },
  default: { bg: 'var(--bg-muted)',  color: 'var(--text-secondary)', border: 'var(--border-default)' },
};

export default function Badge({ children, variant = 'default', style }) {
  const c = COLORS[variant] || COLORS.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: '4px',
      fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap',  /* 11px → 12px */
      background: c.bg, color: c.color,
      border: `0.5px solid ${c.border}`,
      ...style,
    }}>
      {children}
    </span>
  );
}
