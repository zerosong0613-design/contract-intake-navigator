import { useState, useEffect } from 'react';
import Button from './ui/Button.jsx';

const STORAGE_KEY = 'cin_api_key';

// Vercel Edge Function(/api/analyze) 서버 키 설정 여부를 런타임에 확인
// 503 + SERVER_KEY_NOT_CONFIGURED 응답이면 미설정으로 판단
async function checkEdgeFunction() {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '__ping__' }),
    });
    if (res.status === 503) {
      const body = await res.json().catch(() => ({}));
      return body?.error !== 'SERVER_KEY_NOT_CONFIGURED'; // 키는 있지만 다른 이유 503이면 true
    }
    // 400(짧은 텍스트 오류)도 서버 키가 있다는 의미
    return res.status !== 404;
  } catch {
    return false; // 로컬 개발 환경 등 /api/analyze 없음
  }
}

export function loadApiKey() {
  try { return localStorage.getItem(STORAGE_KEY) || ''; }
  catch { return ''; }
}

export function saveApiKey(key) {
  try { localStorage.setItem(STORAGE_KEY, key); }
  catch { /* 비공개/시크릿 모드 fallback */ }
}

export function clearApiKey() {
  try { localStorage.removeItem(STORAGE_KEY); }
  catch {}
}

export default function SettingsModal({ open, onClose, onSave }) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasEdgeKey, setHasEdgeKey] = useState(false);

  useEffect(() => {
    if (open) {
      setKey(loadApiKey());
      setSaved(false);
      checkEdgeFunction().then(setHasEdgeKey);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    const trimmed = key.trim();
    saveApiKey(trimmed);
    onSave(trimmed);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
    onSave('');
  };

  const isValid = key.trim().startsWith('sk-ant-') || key.trim() === '';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.35)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 301, width: '440px', maxWidth: 'calc(100vw - 2rem)',
        background: 'var(--bg-surface)',
        border: '0.5px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>API 키 설정</h3>
            <p style={{ fontSize: '12px', margin: 0 }}>
              Claude AI 분석 기능을 사용하려면 Anthropic API 키가 필요합니다.
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '28px', height: '28px', border: 'none',
            background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)',
            flexShrink: 0, marginLeft: '12px',
          }}>✕</button>
        </div>

        {/* Info box — 서버 키 설정 여부에 따라 다른 안내 */}
        {hasEdgeKey ? (
          <div style={{
            background: 'var(--success-bg, #f0fdf4)', border: '0.5px solid var(--success-border, #bbf7d0)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            fontSize: '12px', color: 'var(--success-text, #166534)', marginBottom: '1.25rem',
            lineHeight: 1.6,
          }}>
            <strong>서버 API 키가 설정되어 있습니다.</strong><br />
            Vercel 서버사이드에서 AI 분석이 실행되므로 브라우저에 별도 키를 입력하지 않아도 됩니다.<br />
            개인 키를 추가 입력하면 서버 키 대신 사용됩니다.
          </div>
        ) : (
          <div style={{
            background: 'var(--info-bg)', border: '0.5px solid var(--info-border)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            fontSize: '12px', color: 'var(--info-text)', marginBottom: '1.25rem',
            lineHeight: 1.6,
          }}>
            <strong>API 키 없이도</strong> 규칙 기반 분석으로 모든 기능을 사용할 수 있습니다.<br />
            AI 분석을 원하면 <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
              style={{ color: 'var(--info-text)', fontWeight: 600 }}>
              console.anthropic.com
            </a> 에서 API 키를 발급 받으세요.<br />
            키는 이 브라우저의 localStorage에만 저장되며, 외부로 전송되지 않습니다.
          </div>
        )}

        {/* Key input */}
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
          Anthropic API Key
        </label>
        <div style={{ position: 'relative', marginBottom: '6px' }}>
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            style={{
              width: '100%', padding: '9px 80px 9px 12px',
              border: `0.5px solid ${!isValid && key ? 'var(--danger-border)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '13px', fontFamily: "'JetBrains Mono', monospace",
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={() => setShow(s => !s)}
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'inherit',
            }}
          >
            {show ? '숨기기' : '보기'}
          </button>
        </div>

        {!isValid && key && (
          <p style={{ fontSize: '11px', color: 'var(--danger-text)', marginBottom: '10px' }}>
            올바른 Anthropic API 키 형식이 아닙니다. (sk-ant-... 로 시작해야 합니다)
          </p>
        )}

        {/* Current status */}
        {loadApiKey() && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', color: 'var(--success-text)', marginBottom: '14px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success-text)' }} />
            현재 저장된 키: {loadApiKey().slice(0, 18)}…
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1rem' }}>
          {loadApiKey() && (
            <Button variant="danger" onClick={handleClear}>키 삭제</Button>
          )}
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button variant="primary" onClick={handleSave} disabled={!isValid}>
            {saved ? '저장됨 ✓' : '저장'}
          </Button>
        </div>
      </div>
    </>
  );
}
