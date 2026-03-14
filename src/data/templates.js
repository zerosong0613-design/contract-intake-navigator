// 표준계약서 추천 데이터
//
// 파일 링크 설정 방법:
//   .env.local (로컬) 또는 Vercel 환경변수에 VITE_TEMPLATE_BASE_URL 을 설정하세요.
//   예: VITE_TEMPLATE_BASE_URL=https://yourcompany.sharepoint.com/sites/legal/templates
//
//   설정 시 각 계약서는 {VITE_TEMPLATE_BASE_URL}/{code} 형식으로 링크됩니다.
//   미설정 시 파일 열기 버튼이 비활성화됩니다.

/**
 * 환경변수 기반 템플릿 URL 빌더
 * @param {string} code - 템플릿 코드 (예: 'NDA-BI')
 * @returns {string|null} URL 또는 null(미설정)
 */
export function getTemplateUrl(code) {
  const base = import.meta.env.VITE_TEMPLATE_BASE_URL || '';
  if (!base || base === 'your_sharepoint_url_here') return null;
  return `${base.replace(/\/$/, '')}/${code}`;
}

export const TEMPLATES = {
  NDA: [
    {
      code: 'NDA-BI',
      name: '양방향 NDA 표준계약서 v2',
      tag: '양방향',
      primary: true,
      version: 'v2.0 (2024.03)',
      useGuide: '기술협력 사전 논의, 입찰 전 자료 교환 등 양측이 모두 비밀정보를 제공하는 경우 사용합니다.',
      cautions: [
        '비밀유지기간 10년 이상은 법무팀 검토 권장',
        '제3자 공유 허용 범위 명시 필요',
        '비밀정보 정의에 구두 정보 포함 여부 확인',
        '계약 종료 후 자료 반환/폐기 조항 확인',
      ],
    },
    {
      code: 'NDA-UNI-D',
      name: '단방향 NDA (당사 제공자) v1.1',
      tag: '단방향 — 당사 제공',
      primary: false,
      version: 'v1.1 (2023.11)',
      useGuide: '당사가 비밀정보를 제공하는 경우 사용합니다. 수령자 의무를 강화한 구조입니다.',
      cautions: [
        '비밀정보 표시 의무(서면 표시) 조항 확인',
        '반환 청구권 조항 삽입 권장',
      ],
    },
    {
      code: 'NDA-UNI-R',
      name: '단방향 NDA (당사 수령자) v1.1',
      tag: '단방향 — 당사 수령',
      primary: false,
      version: 'v1.1 (2023.11)',
      useGuide: '당사가 상대방의 비밀정보를 수령하는 경우 사용합니다.',
      cautions: [
        '당사 책임 범위 과도 확대 여부 확인',
        '예외정보(공지된 정보 등) 범위 검토',
      ],
    },
  ],

  SUPPLY: [
    {
      code: 'SUP-S',
      name: '단건 공급계약서 v3',
      tag: '단발성',
      primary: true,
      version: 'v3.0 (2024.01)',
      useGuide: '일회성 또는 비정기 공급에 사용합니다.',
      cautions: [
        '검수 기준 및 검수 기간 명확화',
        '하자보증 기간 및 보증 범위 확인',
        '대금 지급 조건 및 지연이자 조항',
      ],
    },
    {
      code: 'SUP-F',
      name: '기본거래계약 + 개별발주서 v2',
      tag: '반복 거래',
      primary: false,
      version: 'v2.1 (2023.09)',
      useGuide: '반복 거래 시 기본 조건을 기본계약으로 설정하고 개별발주서로 운영합니다.',
      cautions: [
        '기본계약 vs 개별발주서 우선순위 조항 확인',
        '단가 조정 조항 (원자재 변동 등)',
        '최소발주수량 조항 협상',
      ],
    },
  ],

  SERVICE: [
    {
      code: 'SVC-D',
      name: '결과물 포함형 용역계약서 v2',
      tag: '결과물 있음',
      primary: true,
      version: 'v2.0 (2024.02)',
      useGuide: '소프트웨어 개발, 설계 용역 등 명확한 결과물이 있는 경우 사용합니다.',
      cautions: [
        '결과물 범위 및 검수 기준 구체화 필수',
        '저작권/소유권 귀속 조항 확인',
        '재위탁 허용 여부 및 범위 명시',
        '지연 납품 위약금 조항',
      ],
    },
    {
      code: 'SVC-S',
      name: '인력지원형 용역계약서 v1.2',
      tag: '인력 지원형',
      primary: false,
      version: 'v1.2 (2023.08)',
      useGuide: '파견 또는 상주 지원 등 결과물 없이 인력을 제공받는 경우 사용합니다.',
      cautions: [
        '파견법 위반 여부 법무 확인 필수',
        '업무 지휘·감독 구조 명확화',
        '4대보험 처리 주체 확인',
      ],
    },
  ],

  JOINT_DEV: [
    {
      code: 'JD-S',
      name: '공동개발계약서 v3',
      tag: '기술 공동개발',
      primary: true,
      version: 'v3.0 (2024.04)',
      useGuide: '공동 R&D, 기술 협력 개발 등에 사용합니다. IP 귀속 조항이 핵심입니다.',
      cautions: [
        'IP 귀속 조항 계약 전 확정 필수 — 미정으로 진행 금지',
        '기존 IP(Background IP) 사용권 범위 명확화',
        '비용 분담 기준 및 정산 방법',
        '개발 결과물 이용 범위 및 제3자 실시권',
        'NDA 동시 체결 권장',
      ],
    },
  ],

  LICENSE: [
    {
      code: 'LIC-S',
      name: '기술라이선스계약서 v2',
      tag: '기술 / 특허',
      primary: true,
      version: 'v2.0 (2023.12)',
      useGuide: '기술 또는 특허의 실시권을 부여하는 경우 사용합니다.',
      cautions: [
        '독점/통상 실시권 구분 명확화',
        '로열티 산정 기준 및 감사권 조항',
        '실시 범위(제품, 지역, 기간) 제한',
        '서브라이선스 허용 여부',
      ],
    },
  ],

  CONSIGNMENT: [
    {
      code: 'CON-S',
      name: '위수탁계약서 표준 v1',
      tag: '위수탁',
      primary: true,
      version: 'v1.0 (2023.10)',
      useGuide: '업무 또는 자산의 위탁 운영 계약에 사용합니다.',
      cautions: [
        '위탁자산 관리 책임 및 보험 부보 의무',
        '재위탁 제한 조항 필수 확인',
        '계약 종료 후 자산 반환 절차',
        '개인정보 처리 위탁 포함 시 별도 개인정보처리위탁계약서 필요',
      ],
    },
  ],

  OTHER: [
    {
      code: 'OTH-G',
      name: '법무팀 유형 분류 후 안내',
      tag: '유형 분류 필요',
      primary: true,
      version: '—',
      useGuide: '계약 유형이 불명확한 경우 법무팀이 검토 후 적합한 표준계약서를 안내합니다.',
      cautions: [
        '요청서에 거래 목적 및 구조를 최대한 상세히 기재',
        '상대방 계약서가 있는 경우 첨부 필요',
      ],
    },
  ],
};
