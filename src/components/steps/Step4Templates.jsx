import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import { TEMPLATES } from '../../data/templates.js';

export default function Step4Templates({ ctype, onBack, onGenerate }) {
  const tmpl = TEMPLATES[ctype] || TEMPLATES.OTHER;

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>표준계약서 추천</h2>
        <p style={{ fontSize: '13px' }}>
          입력 정보를 기반으로 아래 표준계약서를 검토하세요.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
        {tmpl.map(t => (
          <Card key={t.code} accent={t.primary}>
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', marginBottom: '8px',
              flexWrap: 'wrap', gap: '8px',
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{t.version}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Badge variant="default">{t.tag}</Badge>
                {t.primary && <Badge variant="success">권장</Badge>}
              </div>
            </div>

            {/* Use guide */}
            <p style={{ fontSize: '12px', marginBottom: '12px', marginTop: 0 }}>{t.useGuide}</p>

            {/* Cautions */}
            <div style={{
              background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '7px' }}>
                주요 확인 조항
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {t.cautions.map((c, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Link — replace '#' with actual SharePoint URL */}
            {t.linkedPath !== '#' && (
              <div style={{ marginTop: '10px' }}>
                <a href={t.linkedPath} target="_blank" rel="noreferrer"
                  style={{ fontSize: '12px', color: 'var(--info-text)', textDecoration: 'none' }}>
                  파일 열기 →
                </a>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onBack}>← 뒤로</Button>
        <Button variant="primary" onClick={onGenerate}>요청서 생성 →</Button>
      </div>
    </div>
  );
}
