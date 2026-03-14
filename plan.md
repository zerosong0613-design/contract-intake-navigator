# Contract Intake Navigator — 기능 현황 & 개선 플랜

> 마지막 업데이트: 2026-03-14 (표준계약서 파일링크 env화, Vercel Edge Function 완료)  
> 버전: v1.2  
> 체크박스 범례: `[x]` 완료 / `[ ]` 미완료 / `[-]` 부분 구현

---

## 1. 현재 구현된 기능 (v1.0 기준)

### 앱 구조
- [x] Vite + React 18 싱글페이지 앱
- [x] Vercel 배포 설정 (`vercel.json`)
- [x] 다크모드 자동 지원 (CSS 변수 기반)
- [x] Google Fonts (Noto Sans KR + JetBrains Mono)
- [x] 페이지 진입 애니메이션 (`animate-in` 클래스)

### 헤더
- [x] 햄버거 아이콘 → NavDrawer 연결
- [x] 5단계 스텝 인디케이터 (완료 단계 클릭 시 이동)
- [x] AI 토글 스위치 (규칙 기반 ↔ Claude AI)
- [x] API 키 설정 버튼 (연결 상태 표시)
- [-] 모바일 반응형 — **버그 있음** (window.innerWidth 직접 참조, resize 미반응)

### NavDrawer (좌측 슬라이드 메뉴)
- [x] 슬라이드인 애니메이션
- [x] 백드롭 클릭 시 닫힘
- [x] 새 요청서 작성 버튼
- [x] 계약 유형 7종 바로 선택
- [-] 관련 링크 섹션 — **미연결** (모두 `#` 하드코딩)

### SettingsModal (API 키 설정)
- [x] API 키 입력 UI (보기/숨기기)
- [x] `sk-ant-` 형식 유효성 검사
- [x] localStorage 저장/불러오기/삭제
- [x] 앱 시작 시 저장된 키 자동 로드
- [x] 키 설정 시 AI 토글 자동 활성화

### Step 1 — 입력
- [x] 자유 입력 텍스트 탭
- [x] 계약서 붙여넣기 탭 (textarea 높이 차이)
- [x] 계약 유형 직접 선택 그리드 (7종)
- [x] 8자 미만 입력 시 분석 버튼 비활성화
- [-] 입력값 보존 — **버그 있음** (뒤로 갔다 오면 초기화)
- [ ] 파일 업로드 (DOCX / PDF / TXT)
- [ ] 글자 수 카운터 + 분석 품질 힌트
- [ ] 분석 중 로딩 오버레이

### Step 2 — 자동 분석 결과
- [x] 규칙 기반 계약 유형 감지 (7종 키워드 매칭)
- [x] Claude AI 분석 (API 실패 시 규칙 기반 fallback)
- [x] 2순위 계약 유형 표시
- [x] 분석 방식 뱃지 (AI / 규칙 기반)
- [x] 자동 추출 정보 표시 (상대방, 기간, 준거법, 손해배상)
- [x] 리스크 플래그 (해외, 개인정보, 기술정보, 손해배상)
- [x] 계약 유형 변경 버튼 7개
- [ ] 유형 변경 UI — accordion으로 축소 (현재 버튼 7개 전부 노출)

### Step 3 — 보완 질문
- [x] 계약 유형별 커스텀 질문셋 (NDA 5개, 공급 5개, 용역 5개, 공동개발 4개, 라이선스 4개, 위수탁 4개, 기타 3개)
- [x] 라디오 버튼 / 텍스트 입력 혼합
- [x] 필수/권장/선택 구분 뱃지
- [x] 필수 항목 완료율 프로그레스 바
- [x] 완료된 항목 초록 뱃지
- [-] 긴급도 질문 — **버그 있음** (OTHER 유형에만 있어서 NDA 등에선 요청서에 "미정" 고정)
- [ ] 라디오 버튼 긴 텍스트 overflow 수정 (모바일)
- [ ] 복합 유형 병행 질문 (예: 공동개발 + NDA 동시 감지 시 NDA 질문 추가)

### Step 4 — 표준계약서 추천
- [x] 계약 유형별 표준계약서 목록 (NDA 3종, 공급 2종, 용역 2종, 공동개발 1종, 라이선스 1종, 위수탁 1종)
- [x] 권장/비권장 구분
- [x] 사용 가이드 텍스트
- [x] 주요 확인 조항 리스트
- [-] 파일 열기 링크 — **미연결** (`#` 하드코딩, SharePoint URL 교체 필요)
- [ ] 복합 유형 병행 추천 표시 (예: 공동개발 + NDA)

### Step 5 — 요청서 생성
- [x] 구조화된 요청서 텍스트 자동 생성 (8개 섹션)
- [x] 클립보드 복사 (fallback 포함)
- [x] TXT 파일 다운로드
- [x] JSON 저장 (SharePoint/Excel 연동용)
- [ ] 요청서 인라인 편집 모드
- [ ] 요청서 출력 뷰 개선 (모노스페이스 → 가독성 있는 렌더링)

### 사이드바 (Step 2~5)
- [x] 검토 준비도 % + 게이지 바
- [x] 준비도 상태 뱃지 (양호/보완필요/정보부족)
- [x] 계약 유형 표시
- [x] 자동 추출 정보 요약 (확인/미확인)
- [x] 리스크 플래그 뱃지
- [x] 미입력 필수 항목 목록 (Step 3+)
- [x] 완료된 답변 목록
- [x] 추천 표준계약서 미리보기 (Step 4+)
- [-] 모바일 대응 — **버그 있음** (248px 고정, 모바일에서 메인 영역 잠식)

### 데이터 / 유틸
- [x] 규칙 기반 유형 감지 (`detect.js`)
- [x] 텍스트 정보 추출 (`extract.js` — 상대방, 기간, 준거법, 손해배상, 플래그 5종)
- [x] 준비도 점수 계산 (`readiness.js`)
- [x] 요청서 텍스트 생성 (`generate.js`)
- [x] 구조화 데이터 생성 (`generateStructuredData`)
- [x] API 키 런타임 주입 (`ai.js`)

---

## 2. 버그 목록 (즉시 수정 대상)

| ID | 위치 | 내용 | 심각도 |
|----|------|------|--------|
| B-01 | `Header.jsx:72` | `window.innerWidth` 직접 참조 → resize 미반응 | 높음 |
| B-02 | `Sidebar.jsx` | 모바일에서 248px 고정 사이드바 → 메인 영역 잠식 | 높음 |
| B-03 | `Step1Input.jsx` | 뒤로 가면 입력값 초기화 (로컬 state) | 높음 |
| B-04 | `questions.js` | 긴급도 질문이 OTHER에만 존재 → 요청서 8항 항상 "미정" | 중간 |
| B-05 | `Header.jsx` | 모바일에서 헤더 우측 요소 overflow | 높음 |

---

## 3. 개선 플랜

### Phase 1 — 버그 수정 (즉시) ✅ 완료 2026-03-14

- [x] **B-01** `useWindowSize` 훅 추가 (`src/utils/useWindowSize.js`), Header에 적용
- [x] **B-02** `Sidebar.jsx` — 모바일(768px 미만)에서 숨기기
- [x] **B-02** `SummaryBar.jsx` 신규 생성 — 모바일 전용 하단 고정 요약 바 (준비도%, 계약 유형, 미입력 건수)
- [x] **B-03** `Step1Input.jsx` — `text` 로컬 state 제거, `value`/`onChange` props로 전환, App.jsx에서 관리
- [x] **B-04** `questions.js` — 긴급도 질문을 모든 유형 공통 마지막 항목으로 추가 (또는 Step3 하단 고정 UI)
- [x] **B-05** `Header.jsx` — 모바일 2-row 구조 변경 (1행: 로고+햄버거, 2행: 진행 표시줄)

### Phase 2 — UX / 가독성 개선 ✅ 완료 2026-03-14

- [x] **폰트 크기 최소값** — 전체 파일에서 11px 이하 → 12px로 상향 (Sidebar 11px, Badge 11px, Header step circle 9px)
- [x] **사이드바 카드 통합** — 현재 6개 카드 → 3개로 (준비도+계약유형 / 추출정보+플래그 / 보완현황)
- [x] **Step3 라디오 버튼** — Grid 레이아웃으로 변경, `whiteSpace: normal`, `minHeight: 36px`
- [x] **분석 중 로딩 오버레이** — textarea 위 overlay + 스피너 + 안내 문구
- [x] **Step2 유형 변경** — accordion 처리 (기본 접힘, 클릭 시 7개 버튼 펼침)
- [x] **NavDrawer 관련 링크** — 환경변수 미설정 시 링크 섹션 자동 숨김 (`VITE_*_URL` 변수 추가)
- [x] **접근성 기초** — `aria-label`, `role="switch"`, `role="radio"`, `aria-expanded` 추가

### Phase 3 — 기능 고도화 ✅ 완료 2026-03-14

- [x] **임시저장** — 주요 상태 변경 시 localStorage 자동 저장, 앱 시작 시 복원 배너 (`src/utils/draft.js`)
- [x] **요청서 편집 모드** — Step5에 편집/미리보기 토글, 편집 시 `contenteditable` 또는 textarea 전환
- [x] **파일 업로드** — DOCX(`mammoth.js`), PDF(`pdf.js`), TXT 드래그앤드롭, 텍스트 추출 후 기존 파이프라인 연결
- [x] **복합 유형 감지** — 1순위 + 2순위 점수가 모두 양수일 때 병행 계약 권장 (Step3 병행 질문, Step4 병행 추천)
- [x] **준비도 점수 보정** — 직접 선택 진입 시 기본 15점 부여, 분기별 점수 로직 개선

### Phase 4 — 연동 / 아키텍처 (장기)

- [ ] **SharePoint 저장** — Step5 "SharePoint에 저장" 버튼, Power Automate HTTP 트리거 연결 (URL 대기 중)
- [x] **표준계약서 파일 링크** — `VITE_TEMPLATE_BASE_URL` 환경변수 기반으로 전환, URL 미설정 시 "파일 링크 미설정" 표시 ✅ 완료 2026-03-14
- [x] **NavDrawer 관련 링크** — 실제 사내 URL 연결
- [x] **Vercel Edge Function** — `api/analyze.js` 생성, 서버사이드 API 키 관리, 브라우저 노출 제거, `ai.js` fallback 로직 추가 ✅ 완료 2026-03-14
- [x] **에러 바운더리** — `ErrorBoundary.jsx` 추가로 예외 상황 시 앱 crash 방지 ✅ 완료 2026-03-14
- [ ] **상태 관리 리팩토링** — App.jsx props drilling → `useReducer` + Context 또는 Zustand (기능 완성 후 마지막)

---

## 4. 파일별 수정 매핑

| 파일 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|---------|
| `App.jsx` | B-02, B-03 | — | 임시저장 | 에러바운더리 |
| `Header.jsx` | B-01, B-05 | 폰트, 접근성 | — | — |
| `Sidebar.jsx` | B-02 | 카드통합, 폰트 | — | — |
| `NavDrawer.jsx` | — | 링크 숨김, 접근성 | — | 실제 URL |
| `SettingsModal.jsx` | — | — | — | Edge Function |
| `Step1Input.jsx` | B-03 | 로딩오버레이 | 파일업로드 | — |
| `Step2Analysis.jsx` | — | Accordion | 복합유형 | — |
| `Step3Questions.jsx` | B-04 | 라디오버튼 | 복합질문 | — |
| `Step4Templates.jsx` | — | — | 복합추천 | 파일링크 |
| `Step5Request.jsx` | — | — | 편집모드 | SharePoint |
| `questions.js` | B-04 | — | — | — |
| `readiness.js` | — | — | 점수보정 | — |
| `templates.js` | — | — | — | 파일링크 |
| `utils/useWindowSize.js` | B-01 (신규) | — | — | — |
| `components/SummaryBar.jsx` | B-02 (신규) | — | — | — |
| `utils/draft.js` | — | — | 임시저장 (신규) | — |

---

## 5. 진행 현황 요약

| Phase | 전체 항목 | 완료 | 진행률 |
|-------|-----------|------|--------|
| Phase 1 — 버그 수정 | 6 | 6 | 100% ✅ |
| Phase 2 — UX/가독성 | 7 | 7 | 100% ✅ |
| Phase 3 — 기능 고도화 | 5 | 5 | 100% ✅ |
| Phase 4 — 연동/아키텍처 | 6 | 4 | 67% 🔄 |
| **합계** | **24** | **22** | **92%** |
