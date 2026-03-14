import { detectContractType } from './detect.js';
import { extractContractInfo, parseAIResult } from './extract.js';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const EDGE_FUNCTION_URL  = '/api/analyze';   // Vercel Serverless Function
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
 * AI 분석 메인 함수
 *
 * 우선순위:
 *   1) Vercel Edge Function (/api/analyze) — 서버 API 키 사용, 브라우저 노출 없음
 *   2) 브라우저 직접 호출 — 사용자가 SettingsModal에서 입력한 키 사용
 *   3) 규칙 기반 fallback
 *
 * @param {string} text    - 사용자 입력
 * @param {string} apiKey  - 런타임 API 키 (SettingsModal에서 전달, Edge Function 있으면 불필요)
 * @returns {{ type, secondary, companion, ext, usedAI, usedEdge, error }}
 */
export async function analyzeWithAI(text, apiKey) {

  // ── 1단계: Edge Function 시도 ─────────────────────────────────────
  try {
    const edgeRes = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 4000) }),
    });

    // 503 = 서버 키 미설정 → 2단계로 넘어감
    if (edgeRes.status === 503) {
      const body = await edgeRes.json().catch(() => ({}));
      if (body?.error === 'SERVER_KEY_NOT_CONFIGURED') {
        throw new Error('SKIP_TO_BROWSER');
      }
    }

    if (!edgeRes.ok) {
      const body = await edgeRes.json().catch(() => ({}));
      throw new Error(body?.message || `Edge Function HTTP ${edgeRes.status}`);
    }

    const parsed = await edgeRes.json();
    return {
      type:      parsed.contractType || 'OTHER',
      secondary: parsed.secondaryType || null,
      companion: null,
      ext:       parseAIResult(parsed),
      usedAI:    true,
      usedEdge:  true,   // 서버사이드 처리 여부 표시
      error:     null,
    };

  } catch (edgeErr) {
    if (edgeErr.message !== 'SKIP_TO_BROWSER') {
      // 네트워크 오류 등 — 로컬 개발 환경에서는 /api/analyze 없을 수 있음
      // 콘솔에만 기록하고 2단계로 넘어감
      console.warn('[ai.js] Edge Function 실패, 브라우저 직접 호출 시도:', edgeErr.message);
    }
  }

  // ── 2단계: 브라우저 직접 호출 ────────────────────────────────────
  const key = apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY || '';

  if (!key || key === 'your_api_key_here') {
    return fallback(text, 'API 키가 설정되지 않았습니다. 규칙 기반으로 분석합니다.');
  }

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
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
      companion: null,
      ext:       parseAIResult(parsed),
      usedAI:    true,
      usedEdge:  false,
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
  const { primary, secondary, companion } = detectContractType(text);
  return {
    type: primary,
    secondary,
    companion: companion || null,
    ext: extractContractInfo(text),
    usedAI:   false,
    usedEdge: false,
    error:    null,
  };
}

function fallback(text, error) {
  const result = analyzeRuleBased(text);
  return { ...result, error };
}

