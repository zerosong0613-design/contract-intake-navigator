import { KEYWORDS } from '../data/keywords.js';

/**
 * 텍스트에서 계약 유형을 규칙 기반으로 감지합니다.
 * @returns {{ primary, secondary, companion, scores }}
 *   companion: 병행 체결 권장 유형 (공동개발+NDA 등)
 */
export function detectContractType(text) {
  if (!text || text.trim().length < 8) {
    return { primary: 'OTHER', secondary: null, companion: null, scores: {} };
  }

  const lo = text.toLowerCase();
  const scores = {};
  Object.entries(KEYWORDS).forEach(([type, kws]) => {
    scores[type] = kws.reduce((acc, kw) => acc + (lo.includes(kw) ? 1 : 0), 0);
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary   = sorted[0][1] > 0 ? sorted[0][0] : 'OTHER';
  const secondary = sorted[1]?.[1] > 0 ? sorted[1][0] : null;

  // 복합 유형 감지: 병행 계약 권장
  const companion = detectCompanion(primary, secondary, scores);

  return { primary, secondary, companion, scores };
}

/**
 * 1순위 유형에 따라 병행 체결이 권장되는 유형을 반환합니다.
 */
function detectCompanion(primary, secondary, scores) {
  // 공동개발 + NDA
  if (primary === 'JOINT_DEV' && scores.NDA > 0) return 'NDA';
  // NDA가 1순위인데 공동개발 신호도 있으면 공동개발 안내
  if (primary === 'NDA' && scores.JOINT_DEV > 0) return 'JOINT_DEV';
  // 라이선스 + NDA
  if (primary === 'LICENSE' && scores.NDA > 0) return 'NDA';
  // 공급 + NDA (기술 자료 공유 동반)
  if (primary === 'SUPPLY' && secondary === 'NDA') return 'NDA';
  return null;
}
