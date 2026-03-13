// 계약 유형별 보완 질문 정의
// type: 'radio' | 'text' | 'select'
// riskLevel: 'high' | 'medium' | 'low'

export const QUESTIONS = {
  NDA: [
    {
      id: 'direction', label: '정보 제공 방향', type: 'radio', required: true,
      riskLevel: 'high',
      help: '어느 방향으로 비밀정보가 교환되나요?',
      opts: ['단방향 (당사 → 상대방)', '단방향 (상대방 → 당사)', '양방향'],
    },
    {
      id: 'period', label: '비밀유지기간', type: 'radio', required: true,
      riskLevel: 'high',
      help: '비밀 유지 의무가 지속되는 기간입니다. 10년 이상은 검토 권장.',
      opts: ['계약기간 + 2년', '계약기간 + 5년', '10년', '영구', '미정'],
    },
    {
      id: 'returnMethod', label: '계약 종료 후 자료 처리', type: 'radio', required: true,
      riskLevel: 'medium',
      opts: ['반환', '폐기', '반환 또는 폐기 선택', '미정'],
    },
    {
      id: 'thirdParty', label: '제3자 공유 허용 범위', type: 'radio', required: false,
      riskLevel: 'medium',
      opts: ['허용', '제한적 허용 (그룹사 내)', '불가', '미정'],
    },
    {
      id: 'infoScope', label: '비밀정보 정의 방식', type: 'radio', required: false,
      riskLevel: 'low',
      opts: ['서면 + 구두 포함', '서면만', '서면 + 구두 포함 (비밀 표시 필요)', '미정'],
    },
  ],

  SUPPLY: [
    {
      id: 'item', label: '공급 품목', type: 'text', required: true,
      riskLevel: 'high',
      ph: '예: 화학원료 A, 전자부품, 포장재',
    },
    {
      id: 'recurring', label: '거래 형태', type: 'radio', required: true,
      riskLevel: 'high',
      help: '단발/반복에 따라 계약 구조가 달라집니다.',
      opts: ['단발성 공급', '반복 거래 (기본거래계약 + 개별발주 권장)'],
    },
    {
      id: 'exclusive', label: '독점 공급 여부', type: 'radio', required: false,
      riskLevel: 'medium',
      opts: ['독점', '비독점', '미정'],
    },
    {
      id: 'warranty', label: '하자보증 기간', type: 'radio', required: false,
      riskLevel: 'medium',
      opts: ['납품 후 1년', '납품 후 2년', '협의', '미정'],
    },
    {
      id: 'payment', label: '대금 지급 조건', type: 'radio', required: false,
      riskLevel: 'low',
      opts: ['납품 후 30일', '납품 후 60일', '선급', '협의', '미정'],
    },
  ],

  SERVICE: [
    {
      id: 'scope', label: '수행 업무 범위', type: 'text', required: true,
      riskLevel: 'high',
      ph: '예: 소프트웨어 개발, 컨설팅, 운영 대행',
    },
    {
      id: 'deliverable', label: '납품물 형태', type: 'radio', required: true,
      riskLevel: 'high',
      help: '결과물 유무에 따라 계약서 유형이 달라집니다.',
      opts: ['결과물 있음', '인력 지원형 (결과물 없음)', '혼합'],
    },
    {
      id: 'ownership', label: '결과물 소유권', type: 'radio', required: true,
      riskLevel: 'high',
      opts: ['당사 귀속', '상대방 귀속', '공동 귀속', '미정'],
    },
    {
      id: 'subcontract', label: '재위탁 허용', type: 'radio', required: false,
      riskLevel: 'medium',
      opts: ['허용', '사전 승인 시 허용', '불가', '미정'],
    },
    {
      id: 'acceptance', label: '검수 기준', type: 'radio', required: false,
      riskLevel: 'medium',
      opts: ['명시적 검수 기준 포함', '상호 협의', '미정'],
    },
  ],

  JOINT_DEV: [
    {
      id: 'ipOwnership', label: '결과물 (IP) 귀속', type: 'radio', required: true,
      riskLevel: 'high',
      help: 'IP 귀속은 공동개발계약의 핵심 쟁점입니다. 미정으로 진행 시 분쟁 위험.',
      opts: ['당사 귀속', '상대방 귀속', '공동 귀속', '기여도 비율 배분', '미정'],
    },
    {
      id: 'costSharing', label: '비용 분담', type: 'radio', required: true,
      riskLevel: 'high',
      opts: ['당사 전액', '상대방 전액', '비율 분담 (협의)', '미정'],
    },
    {
      id: 'existingIP', label: '기존 IP 사용', type: 'radio', required: true,
      riskLevel: 'high',
      opts: ['당사 기존 IP 사용', '상대방 기존 IP 사용', '양측 기존 IP 사용', '해당 없음'],
    },
    {
      id: 'schedule', label: '개발 일정', type: 'text', required: false,
      riskLevel: 'medium',
      ph: '예: 2025년 6월 ~ 12월, 6개월',
    },
  ],

  LICENSE: [
    {
      id: 'licenseType', label: '라이선스 유형', type: 'radio', required: true,
      riskLevel: 'high',
      opts: ['독점 실시권', '통상 실시권', '서브라이선스 포함', '미정'],
    },
    {
      id: 'territory', label: '적용 지역', type: 'radio', required: true,
      riskLevel: 'medium',
      opts: ['국내', '아시아', '글로벌', '특정 국가 지정'],
    },
    {
      id: 'royalty', label: '로열티 구조', type: 'radio', required: true,
      riskLevel: 'high',
      opts: ['정액 라이선스피', '매출 비율 로열티', '정액 + 러닝 로열티', '미정'],
    },
    {
      id: 'auditRight', label: '감사권 포함', type: 'radio', required: false,
      riskLevel: 'medium',
      opts: ['포함', '불포함', '협의', '미정'],
    },
  ],

  CONSIGNMENT: [
    {
      id: 'scope', label: '위탁 업무 범위', type: 'text', required: true,
      riskLevel: 'high',
      ph: '위탁 업무 내용을 간략히 입력하세요.',
    },
    {
      id: 'assetOwnership', label: '위탁 자산 소유권', type: 'radio', required: true,
      riskLevel: 'high',
      opts: ['위탁자(당사) 소유 유지', '수탁자 이전', '미정'],
    },
    {
      id: 'subcontract', label: '재위탁 허용', type: 'radio', required: false,
      riskLevel: 'medium',
      opts: ['허용', '불가', '사전 승인 시 허용', '미정'],
    },
    {
      id: 'insurance', label: '보험 부보 의무', type: 'radio', required: false,
      riskLevel: 'low',
      opts: ['수탁자 부보 의무', '위탁자 부보', '협의', '미정'],
    },
  ],

  OTHER: [
    {
      id: 'purpose', label: '계약 목적', type: 'text', required: true,
      riskLevel: 'high',
      ph: '계약의 주요 목적을 간략히 입력하세요.',
    },
    {
      id: 'urgency', label: '검토 긴급도', type: 'radio', required: true,
      riskLevel: 'medium',
      opts: ['긴급 (3일 이내)', '일반 (1주일 이내)', '여유 (2주 이상)'],
    },
    {
      id: 'notes', label: '법무팀 전달 사항', type: 'text', required: false,
      riskLevel: 'low',
      ph: '특이사항, 주요 관심 조항 등 자유롭게 입력하세요.',
    },
  ],
};
