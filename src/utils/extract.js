/**
 * 계약서 또는 자유입력 텍스트에서 구조화된 정보를 추출합니다.
 * @param {string} text
 * @returns {ExtractedInfo}
 */
export function extractContractInfo(text) {
  if (!text) return {};
  const info = {};

  // 상대방
  const cp = text.match(/(?:주식회사|㈜)\s*([가-힣A-Za-z\d\s]{2,25})/);
  const cpAlt = text.match(/상대방\s*[:：]\s*([가-힣A-Za-z\d\s]{2,30})/);
  if (cp) info.counterparty = cp[0].trim();
  else if (cpAlt) info.counterparty = cpAlt[1].trim();

  // 기간
  const per = text.match(/(\d+)\s*년(?:\s*(?:간|동안))?/);
  const perAlt = text.match(/기간\s*[:：]\s*([^\n,、.]{2,30})/);
  if (per) info.period = per[0].trim();
  else if (perAlt) info.period = perAlt[1].trim();

  // 준거법
  const gov = text.match(/준거법\s*[:：]\s*([^\n,、.]{2,30})/);
  const govAlt = text.match(/(대한민국|뉴욕|영국|싱가포르|일본|중국)\s*(?:법|법률)/);
  if (gov) info.governingLaw = gov[1].trim();
  else if (govAlt) info.governingLaw = govAlt[0].trim();

  // 손해배상
  if (/손해배상/.test(text)) {
    const cap = text.match(/손해배상[^。\n.]{0,60}(?:상한|한도|제한)[^。\n.]{0,30}/i);
    info.damages = cap ? cap[0].trim().slice(0, 60) : '손해배상 조항 있음 (상한 미확인)';
  }

  // 계약금액
  const amountPatterns = [
    // 한국어: 금 XXX원, 계약금액 XXX원, 총 금액 XXX
    /(?:계약\s*금액|총\s*금액|대금|금\s*액)\s*[:：]?\s*([\d,]+\s*(?:원|만원|억원|천만원))/,
    // 숫자+단위 직접 표기
    /([\d,]+\s*(?:억|천만|백만|만)\s*원)/,
    // 영문: USD/KRW + 숫자
    /(?:USD|KRW|EUR|JPY)\s*([\d,]+(?:\.\d+)?)/i,
    // 금 + 숫자 + 원
    /금\s*([\d,]+)\s*원/,
  ];
  for (const pattern of amountPatterns) {
    const m = text.match(pattern);
    if (m) { info.contractAmount = m[0].trim(); break; }
  }

  // 국문/영문 감지 — 한글 문자 비율로 판단
  const koreanChars  = (text.match(/[가-힣]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const total = koreanChars + englishChars;
  if (total > 0) {
    const korRatio = koreanChars / total;
    if (korRatio >= 0.6)       info.language = '국문';
    else if (korRatio <= 0.2)  info.language = '영문';
    else                       info.language = '국문/영문 혼용';
  }

  // 리스크 플래그
  const lo = text.toLowerCase();
  info.hasOverseas  = /해외|외국|international|overseas|foreign|해외법인|외국법인/.test(lo);
  info.hasPersonal  = /개인정보|personal\s*data|privacy|개인식별/.test(lo);
  info.hasTech      = /기술자료|영업비밀|know-how|노하우|특허|발명|기술정보/.test(text);
  info.hasLiability = /손해배상|면책|책임제한|liability/.test(lo);

  return info;
}

/**
 * Anthropic API 응답 JSON에서 계약 정보를 파싱합니다.
 * @param {object} parsed
 * @returns {ExtractedInfo}
 */
export function parseAIResult(parsed) {
  return {
    counterparty:    parsed.counterparty    || null,
    period:          parsed.period          || null,
    governingLaw:    parsed.governingLaw    || null,
    damages:         parsed.damages         || null,
    contractAmount:  parsed.contractAmount  || null,
    language:        parsed.language        || null,
    hasOverseas:     !!parsed.hasOverseas,
    hasPersonal:     !!parsed.hasPersonal,
    hasTech:         !!parsed.hasTech,
    hasLiability:    !!parsed.hasLiability,
  };
}
