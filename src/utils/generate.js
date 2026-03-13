import { QUESTIONS } from '../data/questions.js';
import { TYPE_LABEL } from '../data/keywords.js';

/**
 * 법무팀 제출용 계약검토 요청서 텍스트 생성
 */
export function generateRequest({ type, inputText, ext, answers, urgency }) {
  const label = TYPE_LABEL[type] || type;
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const qs = QUESTIONS[type] || QUESTIONS.OTHER;
  const confirmed = [];
  const missing   = [];

  // 자동 추출 정보
  if (ext?.counterparty) confirmed.push(`상대방: ${ext.counterparty}`);
  else                   missing.push('상대방 명칭');

  if (ext?.period)       confirmed.push(`계약 기간: ${ext.period}`);
  else                   missing.push('계약 기간');

  if (ext?.governingLaw) confirmed.push(`준거법: ${ext.governingLaw}`);
  else                   missing.push('준거법');

  if (ext?.damages)      confirmed.push(`손해배상: ${ext.damages}`);

  // 보완 질문 응답
  qs.forEach(q => {
    const a = answers[q.id]?.trim();
    if (a) confirmed.push(`${q.label}: ${a}`);
    else if (q.required) missing.push(q.label);
  });

  // 리스크 태그
  const risks = [];
  if (ext?.hasOverseas)  risks.push('해외 요소 포함 — 준거법·관할 검토 필요');
  if (ext?.hasPersonal)  risks.push('개인정보 처리 포함 — 개인정보보호법 준수 확인');
  if (ext?.hasTech)      risks.push('기술정보·영업비밀 포함 — 비밀유지 조항 강화 검토');
  if (ext?.hasLiability) risks.push('손해배상/책임제한 조항 포함 — 한도 적정성 검토');

  const hr = '─'.repeat(52);
  const bullet = (arr) => arr.length > 0
    ? arr.map(x => `  · ${x}`).join('\n')
    : '  (해당 없음)';

  const urgencyLabel = urgency || answers.urgency || '미정';

  const lines = [
    `계약검토 요청서`,
    `작성일: ${today}`,
    hr,
    ``,
    `1. 추정 계약 유형`,
    `   ${label}`,
    ``,
    `2. 거래 목적 및 배경`,
    inputText
      ? `   ${inputText.slice(0, 300).replace(/\n/g, '\n   ')}${inputText.length > 300 ? '…' : ''}`
      : `   (직접 입력 없음)`,
    ``,
    `3. 거래 구조 요약`,
    `   계약 유형: ${label}`,
    ext?.counterparty ? `   상대방: ${ext.counterparty}` : null,
    ext?.period       ? `   기간: ${ext.period}`         : null,
    ``,
    `4. 현재 확인된 주요 사항`,
    bullet(confirmed),
    ``,
    `5. 미정 또는 보완 필요 사항`,
    bullet(missing),
    ``,
    `6. 리스크 및 추가 검토 사항`,
    risks.length > 0
      ? risks.map(r => `  [주의] ${r}`).join('\n')
      : `  특이사항 없음`,
    ``,
    `7. 요청사항`,
    `   법무 검토 및 적합한 표준계약서 확인을 요청드립니다.`,
    ``,
    `8. 긴급도`,
    `   ${urgencyLabel}`,
    ``,
    hr,
    `Contract Intake Navigator — 자동 생성`,
  ];

  return lines.filter(l => l !== null).join('\n');
}

/**
 * SharePoint List / Excel 저장용 JSON 생성
 */
export function generateStructuredData({ type, inputText, ext, answers }) {
  const qs = QUESTIONS[type] || QUESTIONS.OTHER;
  const keyInfo = {};
  qs.forEach(q => { if (answers[q.id]) keyInfo[q.id] = answers[q.id]; });

  return {
    RequestDate:          new Date().toISOString(),
    ContractTypePredicted: type,
    ContractTypeConfirmed: type,
    Counterparty:         ext?.counterparty || '',
    Period:               ext?.period       || '',
    GoverningLaw:         ext?.governingLaw || '',
    HasOverseas:          !!ext?.hasOverseas,
    HasPersonal:          !!ext?.hasPersonal,
    HasTech:              !!ext?.hasTech,
    InputSummary:         inputText?.slice(0, 200) || '',
    KeyInfoJson:          JSON.stringify(keyInfo),
    GeneratedAt:          new Date().toISOString(),
  };
}
