# Contract Intake Navigator — 기능 현황 & 개선 플랜

> 마지막 업데이트: 2026-03-14 (Phase 5 완료 — 글자 수 카운터, 라디오 overflow, 계약금액/언어 추출 추가)
> 버전: v1.4 (최종)
> 체크박스 범례: `[x]` 완료 / `[ ]` 미완료 / `[-]` 부분 구현 / `[~]` 보류

---

## 1. 현재 구현된 기능

### 앱 구조
- [x] Vite + React 18 싱글페이지 앱
- [x] Vercel 배포 설정 (`vercel.json`)
- [x] 다크모드 자동 지원 (CSS 변수 기반)
- [x] Google Fonts (Noto Sans KR + JetBrains Mono)
- [x] 페이지 진입 애니메이션 (`animate-in` 클래스)
- [x] ErrorBoundary — 앱 crash 방지, 재시도/새로고침 UI

### 헤더
- [x] 햄버거 아이콘 → NavDrawer 연결
- [x] 5단계 스텝 인디케이터 (완료 단계 클릭 시 이동)
- [x] AI 토글 스위치 (규칙 기반 ↔ Claude AI)
- [x] API 키 설정 버튼 (연결 상태 표시, Edge Function 키 감지)
- [x] 모바일 반응형 — `useWindowSize` 훅, 2-row 구조

### NavDrawer (좌측 슬라이드 메뉴)
- [x] 슬라이드인 애니메이션 + 백드롭 닫힘
- [x] 새 요청서 작성 버튼
- [x] 계약 유형 7종 바로 선택
- [x] 관련 링크 섹션 — `VITE_*_URL` 미설정 시 자동 숨김

### SettingsModal (API 키 설정)
- [x] API 키 입력 UI + `sk-ant-` 유효성 검사
- [x] localStorage 저장/불러오기/삭제
- [x] 앱 시작 시 저장된 키 자동 로드
- [x] Vercel Edge Function 서버 키 설정 여부 자동 감지 + 안내

### Step 1 — 입력
- [x] 자유 입력 / 계약서 붙여넣기 / 파일 업로드 탭
- [x] 계약 유형 직접 선택 그리드 (7종)
- [x] 입력값 보존 (App.jsx props 관리)
- [x] 파일 업로드 — TXT / DOCX / PDF (UMD 스크립트 방식)
- [x] .doc 파일 — DOCX 변환 안내 메시지
- [x] 글자 수 카운터 + 분석 품질 힌트 (30자 미만/100자/300자/이상 4단계)
- [x] 분석 중 로딩 오버레이

### Step 2 — 자동 분석 결과
- [x] 규칙 기반 + Claude AI 분석 (fallback 포함)
- [x] 2순위 계약 유형 / 분석 방식 배지
- [x] 자동 추출 정보 — 상대방, 기간, 계약금액, 국문/영문, 준거법, 손해배상
- [x] 리스크 플래그 (해외, 개인정보, 기술정보, 손해배상)
- [x] 계약 유형 변경 — accordion 처리

### Step 3 — 보완 질문
- [x] 계약 유형별 커스텀 질문셋 (7종)
- [x] 라디오 버튼 / 텍스트 입력 혼합
- [x] 필수/권장/선택 배지 + 완료율 프로그레스 바
- [x] 긴급도 질문 — 모든 유형 공통 항목
- [x] 라디오 버튼 모바일 overflow 수정 — `minmax(min(160px,100%), 1fr)`, `wordBreak: keep-all`
- [x] 복합 유형 병행 안내 배너

### Step 4 — 표준계약서 추천
- [x] 계약 유형별 표준계약서 목록 (NDA 3종, 공급 2종, 용역 2종, 공동개발 1종, 라이선스 1종, 위수탁 1종)
- [x] 권장/비권장 구분 + 주요 확인 조항
- [x] 파일 링크 — `VITE_TEMPLATE_BASE_URL` env 기반 (미설정 시 "파일 링크 미설정")
- [x] 복합 유형 병행 추천 — companion 감지 시 NDA 등 병행 계약서 표시

### Step 5 — 요청서 생성
- [x] 기본정보 패널 (법무시스템 입력용, 복사 제외) — 상대방·기간·계약금액·국문영문·검토요청일
- [x] 복사 영역 3단 구조 — 계약 배경(직접 작성) / 계약서 기본내용(AI 분석) / 검토 요청사항
- [x] 편집/미리보기 토글 + 원본 복원
- [x] TXT 다운로드 / JSON 저장 / 클립보드 복사

### 사이드바 (Step 2~5)
- [x] 검토 준비도 % + 상태 배지
- [x] 추출정보 요약, 리스크 플래그, 미입력 목록
- [x] 모바일 — SummaryBar 하단 고정 요약 바로 대체

### 데이터 / 유틸
- [x] 규칙 기반 유형 감지 + 복합 유형(companion) 감지 (`detect.js`)
- [x] 텍스트 추출 — 상대방, 기간, 계약금액, 국문/영문, 준거법, 손해배상, 리스크 5종 (`extract.js`)
- [x] 준비도 점수 계산 (`readiness.js`)
- [x] 요청서 생성 — `generateRequest` / `generateInfoPanel` / `generateStructuredData` (`generate.js`)
- [x] AI 분석 — Edge Function 우선, 브라우저 fallback, 규칙 기반 fallback (`ai.js`)
- [x] 임시저장 / 복원 (`draft.js`)

---

## 2. 버그 목록

| ID | 위치 | 내용 | 상태 |
|----|------|------|------|
| B-01 | `Header.jsx` | `window.innerWidth` resize 미반응 | ✅ |
| B-02 | `Sidebar.jsx` | 모바일 248px 고정 → 잠식 | ✅ |
| B-03 | `Step1Input.jsx` | 뒤로 가면 입력값 초기화 | ✅ |
| B-04 | `questions.js` | 긴급도 OTHER에만 존재 | ✅ |
| B-05 | `Header.jsx` | 모바일 헤더 overflow | ✅ |
| B-06 | `Step1Input.jsx` | mammoth/pdfjs CDN CORS 차단 | ✅ |
| B-07 | `Step1Input.jsx` | .doc 미분기 — "지원 안 됨" 오류 | ✅ |

---

## 3. 개선 이력

### Phase 1 — 버그 수정 ✅ 완료
B-01~B-05 전체 수정. `useWindowSize` 훅, `SummaryBar` 신규, 모바일 2-row 헤더.

### Phase 2 — UX / 가독성 ✅ 완료
폰트 최소 12px, 사이드바 카드 통합, 라디오 Grid, 로딩 오버레이, accordion, 접근성 기초.

### Phase 3 — 기능 고도화 ✅ 완료
임시저장, 요청서 편집 모드, 파일 업로드, 복합 유형 감지, 준비도 점수 보정.

### Phase 4 — 연동 / 아키텍처 🔄 67%
- [x] 표준계약서 파일 링크 env화 (`VITE_TEMPLATE_BASE_URL`)
- [x] NavDrawer 링크 env화
- [x] Vercel Edge Function (`api/analyze.js`) — 서버사이드 API 키
- [x] ErrorBoundary
- [ ] SharePoint 저장 — URL 대기 중
- [~] 상태 관리 리팩토링 — 보류 (기능 안정화 후 재검토)

### Phase 5 — 품질 개선 ✅ 완료 2026-03-14
- [x] 파일 업로드 CORS 수정 (B-06)
- [x] .doc 안내 메시지 (B-07)
- [x] 텍스트 가독성 — `--text-secondary` / `--text-tertiary` 대비 강화, `p` color primary
- [x] 요청서 구조 개선 — 기본정보 패널 5개 필드, 복사 영역 3단 구조
- [x] 계약금액 / 국문·영문 자동 추출 (`extract.js`, `ai.js` 프롬프트 추가)
- [x] 글자 수 카운터 + 분석 품질 힌트 (Step1)
- [x] 라디오 버튼 모바일 overflow 수정 (Step3)
- [x] 복합 유형 병행 추천 확인 (Step4 — 이미 구현, plan 반영)
- [~] 법무시스템 직접 연동 — 보류 (SharePoint URL 확보 후 Phase 4와 함께)

---

## 4. 파일별 수정 매핑

| 파일 | P1 | P2 | P3 | P4 | P5 |
|------|----|----|----|----|----|
| `App.jsx` | B-02,03 | — | 임시저장 | ErrorBoundary | — |
| `Header.jsx` | B-01,05 | 폰트,접근성 | — | — | — |
| `Sidebar.jsx` | B-02 | 카드통합 | — | — | — |
| `NavDrawer.jsx` | — | 링크숨김 | — | env URL | — |
| `SettingsModal.jsx` | — | — | — | Edge키감지 | — |
| `Step1Input.jsx` | B-03 | 오버레이 | 파일업로드 | — | B-06,07, 카운터 |
| `Step2Analysis.jsx` | — | Accordion | 복합유형 | — | 금액,언어표시 |
| `Step3Questions.jsx` | B-04 | 라디오Grid | 복합질문 | — | 모바일overflow |
| `Step4Templates.jsx` | — | — | 복합추천 | 파일링크 | — |
| `Step5Request.jsx` | — | — | 편집모드 | — | 3단구조 재설계 |
| `utils/extract.js` | — | — | — | — | 금액,언어추출 |
| `utils/generate.js` | — | — | — | — | InfoPanel, 3단구조 |
| `utils/ai.js` | — | — | — | EdgeFunction | 프롬프트확장 |
| `utils/detect.js` | — | — | companion | — | — |
| `utils/readiness.js` | — | — | 점수보정 | — | — |
| `utils/draft.js` | — | — | 신규 | — | — |
| `utils/useWindowSize.js` | B-01신규 | — | — | — | — |
| `index.css` | — | 폰트,색상 | — | — | 가독성강화 |
| `components/SummaryBar.jsx` | B-02신규 | — | — | — | — |
| `components/ErrorBoundary.jsx` | — | — | — | 신규 | — |
| `api/analyze.js` | — | — | — | 신규 | — |
| `templates.js` | — | — | — | 파일링크 | — |
| `questions.js` | B-04 | — | — | — | — |

---

## 5. 진행 현황 요약

| Phase | 전체 | 완료 | 진행률 |
|-------|------|------|--------|
| Phase 1 — 버그 수정 | 6 | 6 | 100% ✅ |
| Phase 2 — UX/가독성 | 7 | 7 | 100% ✅ |
| Phase 3 — 기능 고도화 | 5 | 5 | 100% ✅ |
| Phase 4 — 연동/아키텍처 | 4 | 3 | 75% 🔄 |
| Phase 5 — 품질 개선 | 8 | 8 | 100% ✅ |
| **합계 (보류 제외)** | **30** | **29** | **97%** |

> 잔여: Phase 4 SharePoint 저장 1건 (URL 확보 후 진행)

