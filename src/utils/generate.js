import { QUESTIONS } from '../data/questions.js';
import { TYPE_LABEL } from '../data/keywords.js';

/**
 * 상단 기본정보 패널용 데이터 생성 (법무시스템에 직접 입력할 항목들)
 * — 복사 영역에 포함되지 않음
 */
export function generateInfoPanel({ type, ext, answers, urgency }) {
  const label = TYPE_LABEL[type] || type;
  const qs = QUESTIONS[type] || QUESTIONS.OTHER;

  const urgencyLabel = urgency || answers?.urgency || '미정';

  // 확인된 항목
  const confirmed = [];
  if (ext?.counterparty) confirmed.push({ label: '상대방',  value: ext.counterparty });
  if (ext?.period)       confirmed.push({ label: '계약 기간', value: ext.period });
  if (ext?.governingLaw) confirmed.push({ label: '준거법',   value: ext.governingLaw });
  if (ext?.damages)      confirmed.push({ label: '손해배상', value: ext.damages });
  qs.forEach(q => {
    const a = answers?.[q.id]?.trim();
    if (a) confirmed.push({ label: q.label, value: a });
  });

  // 미정 항목
  const missing = [];
  if (!ext?.counterparty) missing.push('상대방 명칭');
  if (!ext?.period)       missing.push('계약 기간');
  if (!ext?.governingLaw) missing.push('준거법');
  qs.forEach(q => {
    if (q.required && !answers?.[q.id]?.trim()) missing.push(q.label);
  });

  // 리스크 플래그
  const risks = [];
  if (ext?.hasOverseas)  risks.push('해외 요소 포함');
  if (ext?.hasPersonal)  risks.push('개인정보 처리 포함');
  if (ext?.hasTech)      risks.push('기술정보·영업비밀 포함');
  if (ext?.hasLiability) risks.push('손해배상·책임제한 조항 포함');

  return { label, confirmed, missing, risks, urgencyLabel };
}

/**
 * 복사용 요청서 텍스트 생성
 * — 계약 배경(직접 작성 항목) + 검토 요청사항만 포함
 */
export function generateRequest({ type, ext, answers, urgency }) {
  const label = TYPE_LABEL[type] || type;
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const urgencyLabel = urgency || answers?.urgency || '미정';

  // 리스크 기반 검토 요청 항목 자동 생성
  const reviewItems = [];
  if (ext?.hasOverseas)  reviewItems.push('준거법 및 분쟁 해결 관할 적정성 검토');
  if (ext?.hasPersonal)  reviewItems.push('개인정보보호법 준수 여부 및 개인정보처리위탁계약서 필요 여부 확인');
  if (ext?.hasTech)      reviewItems.push('기술정보·영업비밀 보호를 위한 비밀유지 조항 적정성 검토');
  if (ext?.hasLiability) reviewItems.push('손해배상 한도 및 책임제한 조항 적정성 검토');
  // 기본 공통 항목
  reviewItems.push(`${label} 표준계약서 적용 가능 여부 및 수정 필요 조항 안내`);
  reviewItems.push('계약 상대방 조건 중 당사에 불리한 조항 검토');

  const hr2 = '┈'.repeat(48);

  const lines = [
    `[계약검토 요청]  ${today}   긴급도: ${urgencyLabel}`,
    ``,
    `━━ 계약 배경 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
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
    `━━ 검토 요청사항 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    ...reviewItems.map((item, i) => `${i + 1}. ${item}`),
    ``,
    `* 위 항목 외 검토가 필요한 사항이 있으면 아래에 기재해 주세요.`,
    `   → `,
    ``,
    `${hr2}`,
    `⚠ AI 자동 생성 초안입니다. 제출 전 반드시 직접 검토·수정해 주세요.`,
  ];

  return lines.join('\n');
}

/**
 * SharePoint List / Excel 저장용 JSON 생성
 */
export function generateStructuredData({ type, inputText, ext, answers }) {
  const qs = QUESTIONS[type] || QUESTIONS.OTHER;
  const keyInfo = {};
  qs.forEach(q => { if (answers[q.id]) keyInfo[q.id] = answers[q.id]; });

  return {
    RequestDate:           new Date().toISOString(),
    ContractTypePredicted: type,
    ContractTypeConfirmed: type,
    Counterparty:          ext?.counterparty || '',
    Period:                ext?.period       || '',
    GoverningLaw:          ext?.governingLaw || '',
    HasOverseas:           !!ext?.hasOverseas,
    HasPersonal:           !!ext?.hasPersonal,
    HasTech:               !!ext?.hasTech,
    InputSummary:          inputText?.slice(0, 200) || '',
    KeyInfoJson:           JSON.stringify(keyInfo),
    GeneratedAt:           new Date().toISOString(),
  };
}
