import { QUESTIONS } from '../data/questions.js';
import { TYPE_LABEL } from '../data/keywords.js';

/* ─────────────────────────────────────────────────────────────
 * generateInfoPanel
 * 상단 기본정보 패널용 — 법무시스템에 직접 입력할 5개 항목만
 * ───────────────────────────────────────────────────────────── */
export function generateInfoPanel({ type, ext, answers, urgency }) {
  const label        = TYPE_LABEL[type] || type;
  const urgencyLabel = urgency || answers?.urgency || '미정';
  const today        = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return {
    label,
    urgencyLabel,
    today,
    fields: [
      { label: '상대방',     value: ext?.counterparty   || '미정' },
      { label: '계약 기간',  value: ext?.period          || '미정' },
      { label: '계약금액',   value: ext?.contractAmount  || '미정' },
      { label: '국문/영문',  value: ext?.language        || '미정' },
      { label: '검토요청일', value: today },
    ],
  };
}

/* ─────────────────────────────────────────────────────────────
 * generateRequest
 * 복사용 요청서 — 3개 섹션만
 *   1) 계약 배경     (직접 작성)
 *   2) 계약서 기본내용 (AI 분석 결과)
 *   3) 검토 요청사항  (리스크 기반 자동 + 자유 기재란)
 * ───────────────────────────────────────────────────────────── */
export function generateRequest({ type, ext, answers, urgency }) {
  const label        = TYPE_LABEL[type] || type;
  const urgencyLabel = urgency || answers?.urgency || '미정';
  const today        = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const qs = QUESTIONS[type] || QUESTIONS.OTHER;

  /* ── 섹션 2: 계약서 기본내용 빌드 ── */
  const basicLines = [];

  // 자동 추출 항목
  if (ext?.counterparty) basicLines.push(`· 상대방:    ${ext.counterparty}`);
  if (ext?.period)       basicLines.push(`· 계약 기간: ${ext.period}`);
  if (ext?.governingLaw) basicLines.push(`· 준거법:    ${ext.governingLaw}`);
  if (ext?.damages)      basicLines.push(`· 손해배상:  ${ext.damages}`);

  // 보완 질문 응답 (긴급도·법무전달 제외)
  qs.forEach(q => {
    if (q.id === 'urgency' || q.id === 'notes') return;
    const a = answers?.[q.id]?.trim();
    if (a) basicLines.push(`· ${q.label}: ${a}`);
  });

  // 리스크 플래그
  const riskLines = [];
  if (ext?.hasOverseas)  riskLines.push('· 해외 요소 포함 (준거법·관할 주의)');
  if (ext?.hasPersonal)  riskLines.push('· 개인정보 처리 포함');
  if (ext?.hasTech)      riskLines.push('· 기술정보·영업비밀 포함');
  if (ext?.hasLiability) riskLines.push('· 손해배상·책임제한 조항 포함');

  /* ── 섹션 3: 검토 요청사항 빌드 ── */
  const reviewItems = [];
  if (ext?.hasOverseas)  reviewItems.push('준거법 및 분쟁 해결 관할 적정성 검토');
  if (ext?.hasPersonal)  reviewItems.push('개인정보보호법 준수 여부 및 개인정보처리위탁계약서 필요 여부 확인');
  if (ext?.hasTech)      reviewItems.push('기술정보·영업비밀 보호를 위한 비밀유지 조항 적정성 검토');
  if (ext?.hasLiability) reviewItems.push('손해배상 한도 및 책임제한 조항 적정성 검토');
  reviewItems.push(`${label} 표준계약서 적용 가능 여부 및 수정 필요 조항 안내`);
  reviewItems.push('계약 상대방 조건 중 당사에 불리한 조항 검토');

  // 법무팀 전달 사항 (notes)
  const notes = answers?.notes?.trim();

  const S = '━━';
  const lines = [
    `[계약검토 요청]  ${today}   계약유형: ${label}   긴급도: ${urgencyLabel}`,
    ``,
    `${S} 1. 계약 배경 ${'━'.repeat(36)}`,
    ``,
    `① 계약 체결 배경 및 거래 목적`,
    `   → `,
    ``,
    `② 상대방과의 기존 거래 관계`,
    `   (최초 거래 / 기존 계약 갱신 / 기존 계약 내용 변경 등)`,
    `   → `,
    ``,
    `③ 기존 계약서 존재 여부`,
    `   (있음: 계약서명·체결일 기재 / 없음)`,
    `   → `,
    ``,
    `④ 계약 체결까지의 경위 (협상 진행 상황 등)`,
    `   → `,
    ``,
    `${S} 2. 계약서 기본내용 (AI 분석) ${'━'.repeat(22)}`,
    ``,
    ...(basicLines.length > 0 ? basicLines : ['· (분석된 내용 없음 — 계약서를 직접 첨부해 주세요)']),
    ...(riskLines.length > 0 ? [``, `[리스크 감지]`, ...riskLines] : []),
    ``,
    `${S} 3. 검토 요청사항 ${'━'.repeat(32)}`,
    ``,
    ...reviewItems.map((item, i) => `${i + 1}. ${item}`),
    ``,
    `* 위 항목 외 검토가 필요한 사항이 있으면 아래에 기재해 주세요.`,
    `   → ${notes || ''}`,
    ``,
    `${'┈'.repeat(50)}`,
    `⚠ AI 자동 생성 초안입니다. 제출 전 반드시 직접 검토·수정해 주세요.`,
  ];

  return lines.join('\n');
}

/* ─────────────────────────────────────────────────────────────
 * generateStructuredData
 * SharePoint List / Excel 저장용 JSON
 * ───────────────────────────────────────────────────────────── */
export function generateStructuredData({ type, inputText, ext, answers }) {
  const qs = QUESTIONS[type] || QUESTIONS.OTHER;
  const keyInfo = {};
  qs.forEach(q => { if (answers[q.id]) keyInfo[q.id] = answers[q.id]; });

  return {
    RequestDate:           new Date().toISOString(),
    ContractTypePredicted: type,
    ContractTypeConfirmed: type,
    Counterparty:          ext?.counterparty || '',
    Period:                ext?.period        || '',
    GoverningLaw:          ext?.governingLaw  || '',
    HasOverseas:           !!ext?.hasOverseas,
    HasPersonal:           !!ext?.hasPersonal,
    HasTech:               !!ext?.hasTech,
    InputSummary:          inputText?.slice(0, 200) || '',
    KeyInfoJson:           JSON.stringify(keyInfo),
    GeneratedAt:           new Date().toISOString(),
  };
}
