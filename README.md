# Contract Intake Navigator

계약 검토 요청 도우미 — 거래 상황 또는 계약서 초안을 입력하면 계약 유형을 분석하고, 보완 질문을 거쳐 법무팀 제출용 요청서를 자동 생성합니다.

## 파일 구조

```
cin/
├── index.html
├── vite.config.js
├── vercel.json          ← Vercel SPA 라우팅 설정
├── package.json
├── .env.example         ← API 키 환경변수 템플릿
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx           ← 루트 컴포넌트 / 상태 관리
    ├── index.css         ← 디자인 토큰 & 전역 스타일
    ├── data/
    │   ├── keywords.js   ← 계약 유형 감지 키워드
    │   ├── questions.js  ← 유형별 보완 질문 정의
    │   └── templates.js  ← 표준계약서 추천 데이터
    ├── utils/
    │   ├── detect.js     ← 규칙 기반 유형 감지
    │   ├── extract.js    ← 텍스트 정보 추출
    │   ├── ai.js         ← Claude API 호출 + fallback
    │   ├── readiness.js  ← 준비도 점수 계산
    │   └── generate.js   ← 요청서 텍스트 생성
    └── components/
        ├── Header.jsx
        ├── Sidebar.jsx
        ├── ui/
        │   ├── Badge.jsx
        │   ├── Button.jsx
        │   └── Card.jsx
        └── steps/
            ├── Step1Input.jsx
            ├── Step2Analysis.jsx
            ├── Step3Questions.jsx
            ├── Step4Templates.jsx
            └── Step5Request.jsx
```

---

## 로컬 개발

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 VITE_ANTHROPIC_API_KEY=sk-ant-... 입력

# 3. 개발 서버 시작
npm run dev
# → http://localhost:5173
```

---

## Vercel 배포

### 방법 A: GitHub 연동 (권장)

1. GitHub에 이 폴더를 레포지토리로 push
2. vercel.com → New Project → Import Git Repository
3. Framework: **Vite** (자동 감지됨)
4. Environment Variables 에 `VITE_ANTHROPIC_API_KEY` 추가
5. Deploy 클릭

### 방법 B: Vercel CLI

```bash
npm install -g vercel
vercel
# 프롬프트에서 Framework: Vite 선택
```

### 환경변수 (Vercel 대시보드)

| 이름                     | 값              | 설명                        |
|--------------------------|-----------------|-----------------------------|
| `VITE_ANTHROPIC_API_KEY` | `sk-ant-...`   | Claude API 키 (AI 분석 사용 시) |

> **주의**: API 키 없이도 앱은 규칙 기반 모드로 완전히 동작합니다.

---

## 커스터마이징

### 표준계약서 경로 연결
`src/data/templates.js` 에서 각 항목의 `linkedPath` 값을 SharePoint URL로 교체하세요.

```js
linkedPath: 'https://your-company.sharepoint.com/sites/legal/NDA-BI-v2.docx',
```

### 계약 유형 추가
1. `src/data/keywords.js` — 새 유형 코드 + 감지 키워드 추가
2. `src/data/questions.js` — 새 유형의 보완 질문 추가
3. `src/data/templates.js` — 새 유형의 표준계약서 추천 추가

### SharePoint / Excel 저장 연동
`src/utils/generate.js`의 `generateStructuredData()` 함수가
SharePoint List 또는 Excel 저장용 JSON을 반환합니다.
Step5Request.jsx의 "JSON 저장" 버튼에서 이 데이터를 다운로드할 수 있으며,
Power Automate HTTP 트리거에 POST하도록 확장 가능합니다.

---

## 기술 스택

- React 18 + Vite 5
- 스타일: CSS 변수 기반 (프레임워크 없음, 다크모드 자동 지원)
- AI: Anthropic Claude API (`claude-sonnet-4-20250514`) — 선택적 사용
- 배포: Vercel (vercel.json 포함)
