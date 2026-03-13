import { detectContractType } from './detect.js';
import { extractContractInfo, parseAIResult } from './extract.js';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-20250514';

const SYSTEM_PROMPT = `당신은 계약서 분석 전문가입니다.
입력된 텍스트(자유 설명 또는 계약서 초안)를 분석하고 반드시 아래 JSON 형식만 반환하세요.
Markdown 코드블록, 설명, 추가 텍스트 없이 순수 JSON만 반환하세요.

{
  "contractType": "NDA|SUPPLY|SERVICE|JOINT_DEV|LICENSE|CONSIGNMENT|OTHER",
  "secondaryType": "코드 또는 null",
  "counterparty": "상대방 명칭 또는 null",
  "period": "계약 기간 또는 null",
  "governingLaw": "준거법 또는 null",
  "damages": "손해배상 조항 요약 또는 null",
  "hasOverseas": true/false,
  "hasPersonal": true/false,
  "hasTech": true/false,
  "hasLiability": true/false
}`;

/**
 * AI 분석 실행. 실패 시 rule-based fallback.
 * @param {string} text - 사용자 입력
 * @returns {{ type: string, secondary: string|null, ext: object, usedAI: boolean, error: string|null }}
 */
export async function analyzeWithAI(text) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return fallback(text, 'API 키가 설정되지 않았습니다. 규칙 기반으로 분석합니다.');
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `분석 대상:\n${text.slice(0, 4000)}` }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const raw = data?.content?.[0]?.text || '';
    const clean = raw.replace(/```[a-z]*|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      type:      parsed.contractType || 'OTHER',
      secondary: parsed.secondaryType || null,
      ext:       parseAIResult(parsed),
      usedAI:    true,
      error:     null,
    };
  } catch (e) {
    return fallback(text, `AI 분석 오류 (${e.message}). 규칙 기반으로 전환합니다.`);
  }
}

/**
 * 규칙 기반 분석 (AI 없이)
 */
export function analyzeRuleBased(text) {
  const { primary, secondary } = detectContractType(text);
  return {
    type: primary,
    secondary,
    ext: extractContractInfo(text),
    usedAI: false,
    error: null,
  };
}

function fallback(text, error) {
  const result = analyzeRuleBased(text);
  return { ...result, error };
}
