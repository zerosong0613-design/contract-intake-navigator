import { useState, useRef } from 'react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { TYPE_LABEL, ALL_TYPES } from '../../data/keywords.js';

// ── 외부 라이브러리 UMD 스크립트 로더 ────────────────────────────
// dynamic import()는 jsdelivr ESM 번들에서 CORS/모듈 정책 문제가 발생하므로
// <script> 태그 방식으로 UMD 번들을 로드하고 전역 변수를 사용합니다.
function loadScript(src, globalKey) {
  return new Promise((resolve, reject) => {
    if (window[globalKey]) { resolve(window[globalKey]); return; }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      // 이미 로딩 중인 경우 완료 대기
      existing.addEventListener('load', () => resolve(window[globalKey]));
      existing.addEventListener('error', () => reject(new Error(`스크립트 로드 실패: ${src}`)));
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload  = () => resolve(window[globalKey]);
    script.onerror = () => reject(new Error(`스크립트 로드 실패: ${src}`));
    document.head.appendChild(script);
  });
}

export default function Step1Input({ value, onChange, onAnalyze, onManual, useAI, analyzing, error }) {
  const [tab, setTab] = useState('free');
  const [dragOver, setDragOver] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileRef = useRef();

  const canSubmit = value.trim().length >= 8 && !analyzing;

  // ── 파일 텍스트 추출 ──────────────────────────────────────────
  const extractText = async (file) => {
    setFileLoading(true); setFileError('');
    try {
      // TXT
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        return await file.text();
      }

      // DOCX — mammoth UMD 번들 (전역 window.mammoth)
      if (file.name.endsWith('.docx') || file.name.endsWith('.doc') || file.type.includes('wordprocessingml')) {
        const mammoth = await loadScript(
          'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',
          'mammoth'
        );
        if (typeof mammoth?.extractRawText !== 'function') {
          throw new Error('mammoth 라이브러리 로드에 실패했습니다. 새로고침 후 다시 시도해 주세요.');
        }
        const { value: text } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        if (!text?.trim()) throw new Error('문서에서 텍스트를 추출하지 못했습니다. 텍스트가 포함된 DOCX 파일인지 확인해 주세요.');
        return text;
      }

      // PDF — pdfjs UMD 번들 (전역 window.pdfjsLib)
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const pdfjsLib = await loadScript(
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
          'pdfjsLib'
        );
        if (!pdfjsLib?.getDocument) {
          throw new Error('PDF 라이브러리 로드에 실패했습니다. 새로고침 후 다시 시도해 주세요.');
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        const doc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
        const pages = await Promise.all(
          Array.from({ length: doc.numPages }, (_, i) =>
            doc.getPage(i + 1)
              .then(p => p.getTextContent())
              .then(c => c.items.map(s => s.str).join(' '))
          )
        );
        const text = pages.join('\n');
        if (!text?.trim()) throw new Error('PDF에서 텍스트를 추출하지 못했습니다. 스캔 이미지 PDF는 지원되지 않습니다.');
        return text;
      }

      throw new Error('지원하지 않는 파일 형식입니다. (TXT / DOCX / PDF)');
    } catch (e) {
      setFileError(e.message || '파일 읽기 실패');
      return null;
    } finally {
      setFileLoading(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    const text = await extractText(file);
    if (text) { onChange(text); setTab('paste'); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
          어떤 거래를 준비 중이신가요?
        </h2>
        <p style={{ fontSize: '13px' }}>
          거래 상황을 자유롭게 설명하거나, 계약서 초안을 붙여넣거나 파일로 업로드하세요.
        </p>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {[['free', '자유 입력'], ['paste', '계약서 붙여넣기'], ['upload', '파일 업로드']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '5px 14px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 500,
            border: '0.5px solid',
            borderColor: tab === t ? 'var(--border-strong)' : 'var(--border-default)',
            background: tab === t ? 'var(--accent)' : 'transparent',
            color: tab === t ? 'var(--text-inverted)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}>{l}</button>
        ))}
      </div>

      {/* 파일 업로드 탭 */}
      {tab === 'upload' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            minHeight: '160px', border: `1.5px dashed ${dragOver ? 'var(--accent)' : 'var(--border-medium)'}`,
            borderRadius: 'var(--radius-md)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '10px', cursor: 'pointer',
            background: dragOver ? 'var(--bg-hover)' : 'var(--bg-surface)',
            transition: 'border-color 0.15s, background 0.15s',
            padding: '2rem',
          }}
        >
          <input
            ref={fileRef} type="file" accept=".txt,.docx,.pdf"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          {fileLoading ? (
            <>
              <div className="spinning" style={{ width: '24px', height: '24px', border: '2px solid var(--border-default)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>파일을 읽는 중…</span>
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', color: 'var(--text-tertiary)' }}>↑</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                파일을 드래그하거나 클릭해서 선택
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                TXT · DOCX · PDF 지원
              </div>
            </>
          )}
        </div>
      ) : (
        /* 자유입력 / 붙여넣기 textarea */
        <div style={{ position: 'relative' }}>
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={tab === 'free'
              ? '예시:\n· 중국 업체와 기술협력 논의를 위해 자료를 주고받으려 합니다.\n· 외주 개발 계약을 하려는데 결과물은 당사 귀속으로 하고 싶습니다.\n· 상대방이 보낸 공급계약서 초안 검토를 요청하려고 합니다.'
              : '상대방이 보낸 계약서 전문을 여기에 붙여넣으세요.\n시스템이 주요 조항을 자동으로 추출합니다.'}
            style={{
              width: '100%', minHeight: tab === 'paste' ? '240px' : '140px',
              padding: '12px 14px',
              border: '0.5px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px', lineHeight: 1.7,
              background: 'var(--bg-surface)', color: 'var(--text-primary)',
              resize: 'vertical', boxSizing: 'border-box',
              opacity: analyzing ? 0.4 : 1, transition: 'opacity 0.2s',
            }}
          />
          {analyzing && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', borderRadius: 'var(--radius-md)',
            }}>
              <div className="spinning" style={{ width: '22px', height: '22px', border: '2px solid var(--border-default)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {useAI ? 'Claude가 계약서를 분석 중입니다…' : '규칙 기반으로 분석 중…'}
              </span>
            </div>
          )}
        </div>
      )}

      {(error || fileError) && (
        <div style={{ marginTop: '8px' }}>
          <Badge variant="warn">{error || fileError}</Badge>
        </div>
      )}

      {tab !== 'upload' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <Button variant="primary" onClick={() => onAnalyze(value)} disabled={!canSubmit}>
            {analyzing ? '분석 중…' : useAI ? '▸  AI로 분석 시작' : '▸  분석 시작'}
          </Button>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            또는 아래에서 유형 직접 선택
          </span>
        </div>
      )}
      {tab === 'upload' && value.trim().length >= 8 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <Button variant="primary" onClick={() => onAnalyze(value)}>
            {useAI ? '▸  AI로 분석 시작' : '▸  분석 시작'}
          </Button>
          <Badge variant="success">파일 로드 완료 — {value.length.toLocaleString()}자</Badge>
        </div>
      )}

      {/* 유형 직접 선택 */}
      <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '0.5px solid var(--border-default)' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 500 }}>
          계약 유형 직접 선택
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '7px' }}>
          {ALL_TYPES.map(t => (
            <button key={t} onClick={() => onManual(t)} style={{
              padding: '10px 14px', borderRadius: 'var(--radius-md)',
              fontSize: '12px', fontWeight: 500, textAlign: 'left',
              border: '0.5px solid var(--border-default)',
              background: 'var(--bg-muted)', color: 'var(--text-primary)', cursor: 'pointer',
              transition: 'border-color 0.12s, background 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-strong)'; e.currentTarget.style.background='var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-default)'; e.currentTarget.style.background='var(--bg-muted)'; }}
            >
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
