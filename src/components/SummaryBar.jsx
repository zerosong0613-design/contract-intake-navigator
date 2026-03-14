import { TYPE_LABEL } from '../data/keywords.js';
import { QUESTIONS } from '../data/questions.js';
import { calcReadiness, readinessStatus } from '../utils/readiness.js';

export default function SummaryBar({ step, ctype, ext, answers, hasInputText = true }) {
  if (step < 2) return null;

  const qs = QUESTIONS[ctype] || QUESTIONS.OTHER;
  const missingCount = qs.filter(q => q.required && !answers[q.id]?.trim()).length;
  const score = calcReadiness(ctype, ext, answers, hasInputText);
  const status = readinessStatus(score);

  const barColor = status.color === 'success'
    ? 'var(--success-text)'
    : status.color === 'warn'
    ? 'var(--warn-text)'
    : 'var(--danger-text)';

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
      background: 'var(--bg-surface)',
      borderTop: '0.5px solid var(--border-default)',
      padding: '8px 16px 10px',
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
    }}>
      {/* 준비도 */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>준비도</div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: barColor, lineHeight: 1 }}>
          {score}%
        </div>
      </div>

      {/* 게이지 */}
      <div style={{
        flex: 1, height: '4px', background: 'var(--bg-muted)',
        borderRadius: '2px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '2px',
          width: `${score}%`, background: barColor,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* 구분선 */}
      <div style={{ width: '0.5px', height: '28px', background: 'var(--border-default)', flexShrink: 0 }} />

      {/* 계약 유형 + 미입력 현황 */}
      <div style={{ flex: 2, minWidth: 0 }}>
        {ctype && (
          <div style={{
            fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {TYPE_LABEL[ctype]}
          </div>
        )}
        {step >= 3 && missingCount > 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--danger-text)', marginTop: '1px' }}>
            필수 미입력 {missingCount}건
          </div>
        ) : step >= 3 ? (
          <div style={{ fontSize: '12px', color: 'var(--success-text)', marginTop: '1px' }}>
            필수 항목 완료
          </div>
        ) : null}
      </div>
    </div>
  );
}
