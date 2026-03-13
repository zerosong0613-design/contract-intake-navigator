import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { generateStructuredData } from '../../utils/generate.js';

export default function Step5Request({ reqText, ctype, inputText, ext, answers, onBack, onReset }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reqText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // fallback
      const el = document.createElement('textarea');
      el.value = reqText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([reqText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `계약검토요청서_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleDownloadJson = () => {
    const data = generateStructuredData({ type: ctype, inputText, ext, answers });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `계약검토요청_data_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem', flexWrap: 'wrap', gap: '10px',
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '3px' }}>
            계약검토 요청서
          </h2>
          <p style={{ fontSize: '13px', margin: 0 }}>
            법무팀 제출용 요청서가 생성되었습니다.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={handleDownloadJson}>
            JSON 저장
          </Button>
          <Button variant="outline" onClick={handleDownloadTxt}>
            {downloaded ? '저장됨!' : 'TXT 저장'}
          </Button>
          <Button variant="primary" onClick={handleCopy}>
            {copied ? '복사됨 ✓' : '클립보드 복사'}
          </Button>
        </div>
      </div>

      {/* Notice */}
      <div style={{
        background: 'var(--success-bg)', border: '0.5px solid var(--success-border)',
        borderRadius: 'var(--radius-md)', padding: '10px 14px',
        fontSize: '12px', color: 'var(--success-text)', marginBottom: '12px',
      }}>
        요청서를 복사하여 법무팀 이메일 또는 사내 포털에 붙여넣으세요.
        JSON 저장은 SharePoint / Excel 대시보드 연동 시 활용합니다.
      </div>

      <textarea
        readOnly
        value={reqText}
        style={{
          width: '100%', minHeight: '480px',
          padding: '16px',
          border: '0.5px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px', lineHeight: 1.8,
          background: 'var(--bg-muted)',
          color: 'var(--text-primary)',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="outline" onClick={onBack}>← 뒤로</Button>
        <Button variant="ghost" onClick={onReset}>+ 새 요청서 작성</Button>
      </div>
    </div>
  );
}
