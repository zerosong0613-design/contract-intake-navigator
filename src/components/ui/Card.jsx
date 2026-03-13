export default function Card({ children, style, accent }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `0.5px solid ${accent ? 'var(--border-strong)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      ...style,
    }}>
      {children}
    </div>
  );
}
