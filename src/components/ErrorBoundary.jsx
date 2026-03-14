import { Component } from 'react';

/**
 * ErrorBoundary — 앱 전체 crash 방지
 *
 * 사용법:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * 개발 환경에서는 에러 상세 정보(스택 트레이스)를 함께 표시합니다.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // 추후 Sentry 등 외부 에러 로깅 서비스 연결 시 이 위치에 추가
    console.error('[ErrorBoundary] 렌더링 에러 발생:', error, errorInfo);
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = import.meta.env.DEV;

    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          {/* 아이콘 */}
          <div style={styles.iconWrap}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-danger, #ef4444)" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* 제목 & 설명 */}
          <h2 style={styles.title}>예상치 못한 오류가 발생했어요</h2>
          <p style={styles.desc}>
            일시적인 문제일 수 있습니다. 아래 버튼을 눌러 다시 시도해 주세요.
            <br />
            문제가 반복되면 페이지를 새로고침 해주세요.
          </p>

          {/* 버튼 */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={this.handleReset}>
              다시 시도
            </button>
            <button style={styles.btnSecondary} onClick={() => window.location.reload()}>
              페이지 새로고침
            </button>
          </div>

          {/* 개발 환경 전용: 에러 상세 */}
          {isDev && this.state.error && (
            <details style={styles.details}>
              <summary style={styles.summary}>에러 상세 (개발 환경 전용)</summary>
              <pre style={styles.pre}>
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}

/* ─── 인라인 스타일 (CSS 변수 활용) ─────────────────────────────── */
const styles = {
  overlay: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: 'var(--color-bg, #f9fafb)',
  },
  card: {
    background: 'var(--color-surface, #ffffff)',
    border: '1px solid var(--color-border, #e5e7eb)',
    borderRadius: '16px',
    padding: '40px 32px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  iconWrap: {
    marginBottom: '16px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text, #111827)',
    margin: '0 0 12px',
  },
  desc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary, #6b7280)',
    lineHeight: '1.6',
    margin: '0 0 24px',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    background: 'var(--color-primary, #6366f1)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: '1px solid var(--color-border, #e5e7eb)',
    background: 'transparent',
    color: 'var(--color-text, #111827)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  details: {
    marginTop: '24px',
    textAlign: 'left',
  },
  summary: {
    fontSize: '12px',
    color: 'var(--color-text-secondary, #6b7280)',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  pre: {
    fontSize: '11px',
    background: 'var(--color-bg, #f9fafb)',
    border: '1px solid var(--color-border, #e5e7eb)',
    borderRadius: '8px',
    padding: '12px',
    overflow: 'auto',
    maxHeight: '200px',
    color: 'var(--color-danger, #ef4444)',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
};
