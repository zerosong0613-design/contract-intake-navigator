import { KEYWORDS } from '../data/keywords.js';

/**
 * 텍스트에서 계약 유형을 규칙 기반으로 감지합니다.
 * @param {string} text
 * @returns {{ primary: string, secondary: string|null, scores: Record<string,number> }}
 */
export function detectContractType(text) {
  if (!text || text.trim().length < 8) {
    return { primary: 'OTHER', secondary: null, scores: {} };
  }

  const lo = text.toLowerCase();
  const scores = {};

  Object.entries(KEYWORDS).forEach(([type, kws]) => {
    scores[type] = kws.reduce((acc, kw) => acc + (lo.includes(kw) ? 1 : 0), 0);
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][1] > 0 ? sorted[0][0] : 'OTHER';
  const secondary = sorted[1]?.[1] > 0 ? sorted[1][0] : null;

  return { primary, secondary, scores };
}
