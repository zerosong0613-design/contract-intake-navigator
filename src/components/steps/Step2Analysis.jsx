import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import { TYPE_LABEL, ALL_TYPES } from '../../data/keywords.js';

export default function Step2Analysis({ ctype, secondary, ext, usedAI, onChangeType, onBack, onNext }) {
  const INFO_ROWS = [
    ['counterparty', '상대방'],
    ['period',       '계약 기간'],
    ['governingLaw', '준거법'],
    ['damages',      '손해배상'],
  ];

  const flags = [
    ext?.hasOverseas  && '해외 요소',
    ext?.hasPersonal  && '개인정보',
    ext?.hasTech      && '기술정보',
    ext?.hasLiability && '손해배상 조항',
  ].filter(Boolean);

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>자동 분석 결과</h2>
        <p style={{ fontSize: '13px' }}>
          추정 결과를 확인하고, 유형이 다르면 아래에서 변경하세요.
        </p>
      </div>

      {/* Detected type */}
      <Card style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 500 }}>
          추정 계약 유형
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span style={{ fontSize: '18px', fontWeight: 600 }}>{TYPE_LABEL[ctype]}</span>
          {secondary && (
            <Badge variant="default">2순위: {TYPE_LABEL[secondary]}</Badge>
          )}
          <Badge variant={usedAI ? 'success' : 'default'}>
            {usedAI ? 'Claude AI' : '규칙 기반'}
          </Badge>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
          유형 변경
        </div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {ALL_TYPES.map(t => (
            <button key={t} onClick={() => onChangeType(t)} style={{
              padding: '4px 10px', borderRadius: '20px', cursor: 'pointer',
              fontSize: '11px', fontWeight: 500, border: '0.5px solid',
              borderColor: ctype === t ? 'transparent' : 'var(--border-medium)',
              background: ctype === t ? 'var(--accent)' : 'transparent',
              color: ctype === t ? 'var(--text-inverted)' : 'var(--text-primary)',
              transition: 'all 0.1s',
            }}>
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </Card>

      {/* Extracted info */}
      <Card style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500 }}>
          자동 추출된 정보
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px',
        }}>
          {INFO_ROWS.map(([k, label]) => (
            <div key={k}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {label}
              </div>
              {ext?.[k] ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{ext[k]}</span>
                  <Badge variant="success">확인</Badge>
                </div>
              ) : (
                <Badge variant="danger">미확인</Badge>
              )}
            </div>
          ))}
        </div>

        {flags.length > 0 && (
          <div style={{
            marginTop: '14px', paddingTop: '12px',
            borderTop: '0.5px solid var(--border-default)',
            display: 'flex', gap: '6px', flexWrap: 'wrap',
          }}>
            {flags.map(f => <Badge key={f} variant="warn">{f}</Badge>)}
          </div>
        )}
      </Card>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onBack}>← 다시 입력</Button>
        <Button variant="primary" onClick={onNext}>보완 질문으로 →</Button>
      </div>
    </div>
  );
}
