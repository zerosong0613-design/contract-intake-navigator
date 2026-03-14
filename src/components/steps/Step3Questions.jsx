import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import { QUESTIONS } from '../../data/questions.js';
import { TYPE_LABEL } from '../../data/keywords.js';

const RISK_BADGE = {
  high:   { label: '필수', v: 'danger'  },
  medium: { label: '권장', v: 'warn'    },
  low:    { label: '선택', v: 'default' },
};

export default function Step3Questions({ ctype, companion, answers, onAnswer, onBack, onNext }) {
  const qs = QUESTIONS[ctype] || QUESTIONS.OTHER;
  const required = qs.filter(q => q.required);
  const doneCount = required.filter(q => answers[q.id]?.trim()).length;

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>추가 정보 입력</h2>
        <p style={{ fontSize: '13px' }}>
          {TYPE_LABEL[ctype]} 검토에 필요한 항목입니다. 미정인 경우 건너뛰어도 됩니다.
        </p>
        {companion && (
          <div style={{
            marginTop: '8px', padding: '7px 12px',
            background: 'var(--warn-bg)', border: '0.5px solid var(--warn-border)',
            borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--warn-text)',
          }}>
            병행 체결 권장: <strong>{TYPE_LABEL[companion]}</strong> 검토도 함께 진행하세요.
          </div>
        )}
        {required.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              필수 항목 {doneCount} / {required.length} 완료
            </div>
            <div style={{ flex: 1, height: '4px', background: 'var(--bg-muted)', borderRadius: '2px', maxWidth: '120px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: 'var(--success-text)', borderRadius: '2px',
                width: `${required.length > 0 ? (doneCount / required.length) * 100 : 0}%`,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {qs.map(q => {
          const rb = RISK_BADGE[q.riskLevel] || RISK_BADGE.low;
          const isDone = !!answers[q.id]?.trim();

          return (
            <Card key={q.id} style={{
              borderColor: isDone ? 'var(--border-default)' : q.required ? 'var(--warn-border)' : 'var(--border-default)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{q.label}</span>
                  <Badge variant={rb.v}>{rb.label}</Badge>
                </div>
                {isDone && <Badge variant="success">완료</Badge>}
              </div>

              {q.help && <p style={{ fontSize: '12px', marginBottom: '10px', marginTop: '0', color: 'var(--text-secondary)' }}>{q.help}</p>}

              {q.type === 'radio' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: q.opts.length <= 2
                    ? `repeat(${q.opts.length}, 1fr)`
                    : 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
                  gap: '6px',
                }}>
                  {q.opts.map(opt => {
                    const selected = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onAnswer(q.id, opt)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '12px', fontWeight: 500,
                          cursor: 'pointer', textAlign: 'left',
                          whiteSpace: 'normal', lineHeight: 1.5,
                          minHeight: '36px',
                          wordBreak: 'keep-all',
                          overflowWrap: 'break-word',
                          border: '0.5px solid',
                          borderColor: selected ? 'transparent' : 'var(--border-medium)',
                          background: selected ? 'var(--accent)' : 'transparent',
                          color: selected ? 'var(--text-inverted)' : 'var(--text-primary)',
                          transition: 'all 0.1s',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'text' && (
                <input
                  type="text"
                  placeholder={q.ph}
                  value={answers[q.id] || ''}
                  onChange={e => onAnswer(q.id, e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px',
                    border: '0.5px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </Card>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
        <Button variant="outline" onClick={onBack}>← 뒤로</Button>
        <Button variant="primary" onClick={onNext}>표준계약서 추천 →</Button>
      </div>
    </div>
  );
}
