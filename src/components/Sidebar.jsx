import { useState } from 'react';
import Badge from './ui/Badge.jsx';
import Card from './ui/Card.jsx';
import { TYPE_LABEL } from '../data/keywords.js';
import { QUESTIONS } from '../data/questions.js';
import { TEMPLATES } from '../data/templates.js';
import { calcReadiness, readinessStatus } from '../utils/readiness.js';

/* ── 카드 통합: 6개 → 3개 ──────────────────────────────────────
   Card A: 준비도 + 계약 유형
   Card B: 추출 정보 + 리스크 플래그
   Card C: 보완 현황 (미입력 목록 + 완료 개수)
   Card D: 추천 계약서 (step 4+)
──────────────────────────────────────────────────────────────── */

export default function Sidebar({ step, ctype, ext, answers, hidden, hasInputText = true }) {
  if (step < 2 || hidden) return null;

  const qs = QUESTIONS[ctype] || QUESTIONS.OTHER;
  const tmpl = TEMPLATES[ctype] || TEMPLATES.OTHER;
  const score = calcReadiness(ctype, ext, answers, hasInputText);
  const status = readinessStatus(score);
  const missingReq = qs.filter(q => q.required && !answers[q.id]?.trim());
  const completedCount = Object.values(answers).filter(v => v?.trim()).length;

  const rampColor = status.color === 'success'
    ? 'var(--success-text)' : status.color === 'warn'
    ? 'var(--warn-text)' : 'var(--danger-text)';

  const flags = [
    ext?.hasOverseas  && { label: '해외 요소',    v: 'warn'    },
    ext?.hasPersonal  && { label: '개인정보',      v: 'warn'    },
    ext?.hasTech      && { label: '기술정보',      v: 'warn'    },
    ext?.hasLiability && { label: '손해배상 조항', v: 'default' },
  ].filter(Boolean);

  const label = (text) => (
    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
      {text}
    </div>
  );

  return (
    <aside style={{
      width: '248px', flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: '10px',
      position: 'sticky', top: '64px',
      maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
      paddingBottom: '2rem',
    }}>

      {/* ── Card A: 준비도 + 계약 유형 ── */}
      <Card>
        {label('검토 준비도')}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '28px', fontWeight: 600 }}>{score}%</span>
          <Badge variant={status.color}>{status.label}</Badge>
        </div>
        <div style={{ height: '5px', background: 'var(--bg-muted)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{
            height: '100%', borderRadius: '3px',
            width: `${score}%`, background: rampColor,
            transition: 'width 0.5s ease',
          }} />
        </div>
        {ctype && (
          <>
            <div style={{ height: '0.5px', background: 'var(--border-default)', margin: '0 0 12px' }} />
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>계약 유형</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{TYPE_LABEL[ctype]}</div>
          </>
        )}
      </Card>

      {/* ── Card B: 추출 정보 + 플래그 ── */}
      <Card>
        {label('자동 추출 정보')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {[['counterparty','상대방'],['period','기간'],['governingLaw','준거법']].map(([k, lbl]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flexShrink: 0 }}>{lbl}</span>
              {ext?.[k]
                ? <span style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px', textAlign: 'right' }}>{ext[k]}</span>
                : <Badge variant="danger">미확인</Badge>
              }
            </div>
          ))}
        </div>
        {flags.length > 0 && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '0.5px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {flags.map(f => <Badge key={f.label} variant={f.v}>{f.label}</Badge>)}
          </div>
        )}
      </Card>

      {/* ── Card C: 보완 현황 (step 3+) ── */}
      {step >= 3 && (
        <Card style={{ borderColor: missingReq.length > 0 ? 'var(--danger-border)' : 'var(--border-default)' }}>
          {label('보완 현황')}
          <div style={{ display: 'flex', gap: '12px', marginBottom: missingReq.length > 0 ? '12px' : '0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--success-text)' }}>{completedCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>완료</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: missingReq.length > 0 ? 'var(--danger-text)' : 'var(--text-tertiary)' }}>{missingReq.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>필수 미입력</div>
            </div>
          </div>
          {missingReq.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {missingReq.map(q => (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--danger-text)', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px' }}>{q.label}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ── Card D: 추천 계약서 (step 4+) ── */}
      {step >= 4 && (
        <Card>
          {label('추천 표준계약서')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {tmpl.map(t => (
              <div key={t.code} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', marginTop: '4px', background: t.primary ? 'var(--success-text)' : 'var(--border-strong)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{t.version}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </aside>
  );
}
