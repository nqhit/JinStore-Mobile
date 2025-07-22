import { router, usePathname } from 'expo-router';
import { useCallback, useRef } from 'react';

export const useSingledPush = () => {
  const pathname = usePathname();
  const isNavigating = useRef(false);

  return useCallback(
    (to: string, params?: Record<string, any>) => {
      if (pathname !== to && !isNavigating.current) {
        isNavigating.current = true;
        router.push({ pathname: to as any, params });
        setTimeout(() => {
          isNavigating.current = false;
        }, 500);
      }
    },
    [pathname],
  );
};
