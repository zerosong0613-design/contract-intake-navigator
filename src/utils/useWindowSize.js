import { useState, useEffect } from 'react';

/**
 * 창 너비를 반응형으로 추적하는 훅.
 * resize 이벤트에 반응하며, SSR 환경에서도 안전하게 동작합니다.
 */
export function useWindowSize() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return { width, isMobile: width < 768, isTablet: width < 1024 };
}
