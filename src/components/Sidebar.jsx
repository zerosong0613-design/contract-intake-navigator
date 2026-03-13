import Badge from './ui/Badge.jsx';
import Card from './ui/Card.jsx';
import { TYPE_LABEL } from '../data/keywords.js';
import { QUESTIONS } from '../data/questions.js';
import { TEMPLATES } from '../data/templates.js';
import { calcReadiness, readinessStatus } from '../utils/readiness.js';

export default function Sidebar({ step, ctype, ext, answers }) {
  if (step < 2) return null;

  const qs = QUESTIONS[ctype] || QUESTIONS.OTHER;
  const tmpl = TEMPLATES[ctype] || TEMPLATES.OTHER;
  const score = calcReadiness(ctype, ext, answers);
  const status = readinessStatus(score);
  const missingReq = qs.filter(q => q.required && !answers[q.id]?.trim());
  const completedAnswers = Object.entries(answers).filter(([, v]) => v?.trim());

  const rampColor = status.color === 'success'
    ? 'var(--success-text)' : status.color === 'warn'
    ? 'var(--warn-text)' : 'var(--danger-text)';

  const flags = [
    ext?.hasOverseas  && { label: '해외 요소',   v: 'warn'    },
    ext?.hasPersonal  && { label: '개인정보',     v: 'warn'    },
    ext?.hasTech      && { label: '기술정보',     v: 'warn'    },
    ext?.hasLiability && { label: '손해배상 조항', v: 'default' },
  ].filter(Boolean);

  return (
    <aside style={{
      width: '248px', flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: '10px',
      position: 'sticky', top: '64px',
      maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
      paddingBottom: '2rem',
    }}>
      {/* Readiness gauge */}
      <Card>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
          검토 준비도
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '28px', fontWeight: 600 }}>{score}%</span>
          <Badge variant={status.color}>{status.label}</Badge>
        </div>
        <div style={{ height: '6px', background: 'var(--bg-muted)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '3px',
            width: `${score}%`, background: rampColor,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </Card>

      {/* Contract type */}
      {ctype && (
        <Card>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
            계약 유형
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>{TYPE_LABEL[ctype]}</div>
        </Card>
      )}

      {/* Extracted info */}
      <Card>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 500 }}>
          자동 추출 정보
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {[
            ['counterparty', '상대방'],
            ['period',       '기간'],
            ['governingLaw', '준거법'],
          ].map(([k, label]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', flexShrink: 0 }}>{label}</span>
              {ext?.[k]
                ? <span style={{
                    fontSize: '11px', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    maxWidth: '130px', textAlign: 'right',
                  }}>{ext[k]}</span>
                : <Badge variant="danger">미확인</Badge>
              }
            </div>
          ))}
        </div>
        {flags.length > 0 && (
          <div style={{
            marginTop: '10px', paddingTop: '10px',
            borderTop: '0.5px solid var(--border-default)',
            display: 'flex', flexDirection: 'column', gap: '5px',
          }}>
            {flags.map(f => (
              <Badge key={f.label} variant={f.v}>{f.label}</Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Missing required */}
      {missingReq.length > 0 && step >= 3 && (
        <Card style={{ borderColor: 'var(--danger-border)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
            미입력 필수 항목
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {missingReq.map(q => (
              <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: 'var(--danger-text)', flexShrink: 0,
                }} />
                <span style={{ fontSize: '11px' }}>{q.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Completed answers */}
      {completedAnswers.length > 0 && (
        <Card>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
            입력 완료 ({completedAnswers.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {completedAnswers.map(([k, v]) => {
              const q = qs.find(q => q.id === k);
              if (!q) return null;
              return (
                <div key={k}>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{q.label}</div>
                  <div style={{ fontSize: '11px', fontWeight: 500, marginTop: '1px' }}>{v}</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Template preview */}
      {step >= 4 && (
        <Card>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
            추천 표준계약서
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {tmpl.map(t => (
              <div key={t.code} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%', marginTop: '4px',
                  background: t.primary ? 'var(--success-text)' : 'var(--border-strong)',
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{t.version}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </aside>
  );
}
