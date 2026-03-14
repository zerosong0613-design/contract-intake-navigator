/**
 * api/analyze.js — Vercel Serverless Function
 *
 * 역할: 브라우저에서 Anthropic API 키를 직접 노출하지 않고
 *       서버사이드에서 Claude AI 분석을 실행합니다.
 *
 * 환경변수 설정 (Vercel 대시보드 → Settings → Environment Variables):
 *   ANTHROPIC_API_KEY=sk-ant-api03-...
 *   (VITE_ 접두사 없음 — 서버 전용이므로 브라우저에 노출되지 않습니다)
 *
 * 요청 형식:
 *   POST /api/analyze
 *   Content-Type: application/json
 *   Body: { text: string }
 *
 * 응답 형식 (성공):
 *   { contractType, secondaryType, counterparty, period,
 *     governingLaw, damages, hasOverseas, hasPersonal, hasTech, hasLiability }
 *
 * 응답 형식 (실패):
 *   { error: string }  — HTTP 4xx/5xx
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

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

export default async function handler(req, res) {
  // CORS — 같은 도메인에서만 허용 (Vercel 배포 도메인)
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 외 거부
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
  }

  // 서버 API 키 확인
  const apiKey = process.env.ANTHROPIC_API_KEY || '';
  if (!apiKey || apiKey === 'your_api_key_here') {
    // 서버 키 미설정 — 클라이언트가 직접 호출하도록 안내
    return res.status(503).json({
      error: 'SERVER_KEY_NOT_CONFIGURED',
      message: '서버에 API 키가 설정되지 않았습니다. 브라우저 키를 사용합니다.',
    });
  }

  // 입력 검증
  const { text } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim().length < 8) {
    return res.status(400).json({ error: '분석할 텍스트가 너무 짧습니다.' });
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `분석 대상:\n${text.slice(0, 4000)}` }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Anthropic API HTTP ${response.status}`);
    }

    const data = await response.json();
    const raw = data?.content?.[0]?.text || '';
    const clean = raw.replace(/```[a-z]*|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);

  } catch (e) {
    console.error('[api/analyze] 오류:', e.message);
    return res.status(500).json({
      error: 'ANALYSIS_FAILED',
      message: e.message,
    });
  }
}
