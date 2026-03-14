import { QUESTIONS } from '../data/questions.js';

/**
 * 준비도 점수 (0–100) 계산
 * - 직접 선택 진입(inputText 없음) 시 기본 15점 부여
 * - 필수 질문 응답 비율 → 최대 50점
 * - 자동 추출 정보 보너스 → 최대 35점
 */
export function calcReadiness(type, ext, answers, hasInputText = true) {
  const qs = QUESTIONS[type] || QUESTIONS.OTHER;
  const required = qs.filter(q => q.required);
  const done = required.filter(q => answers[q.id]?.trim());

  // 필수 질문 응답 비율 → 50점
  const formScore = required.length > 0
    ? Math.round((done.length / required.length) * 50)
    : 25;

  // 추출 정보 보너스 (자유입력/붙여넣기 경로만 해당)
  let bonus = 0;
  if (ext?.counterparty) bonus += 15;
  if (ext?.period)        bonus += 15;
  if (ext?.governingLaw)  bonus += 10;
  if (ext?.damages)       bonus +=  5;
  if (ext?.hasOverseas !== undefined) bonus += 5;

  // 직접 선택 진입 보정: 텍스트 입력 없이 시작한 경우 기본 15점 부여
  const base = !hasInputText ? 15 : 0;

  return Math.min(100, base + formScore + bonus);
}

/**
 * 준비도에 따른 상태 레이블 + 색상
 */
export function readinessStatus(score) {
  if (score >= 80) return { label: '준비 양호',      color: 'success' };
  if (score >= 55) return { label: '일부 보완 필요',  color: 'warn'    };
  return                  { label: '정보 부족',       color: 'danger'  };
}
