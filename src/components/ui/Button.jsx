export default function Button({ children, onClick, variant = 'outline', disabled, style, fullWidth }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', padding: '8px 18px',
    borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.42 : 1,
    border: 'none', outline: 'none',
    width: fullWidth ? '100%' : undefined,
    whiteSpace: 'nowrap',
    transition: 'background 0.12s, opacity 0.12s',
  };

  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--text-inverted)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '0.5px solid var(--border-medium)',
    },
    ghost: {
      background: 'var(--bg-muted)',
      color: 'var(--text-secondary)',
      border: '0.5px solid var(--border-default)',
    },
    danger: {
      background: 'var(--danger-bg)',
      color: 'var(--danger-text)',
      border: '0.5px solid var(--danger-border)',
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...(variants[variant] || variants.outline), ...style }}
    >
      {children}
    </button>
  );
}
