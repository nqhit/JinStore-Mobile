// navigationUtils.ts
import { router, usePathname } from 'expo-router';
import { throttle } from 'lodash';
import { useMemo } from 'react';

export const useSingledPush = (delay: number = 1000) => {
  const pathname = usePathname();

  return useMemo(() => {
    return throttle(
      (to: string) => {
        if (pathname !== to) {
          router.push(to as any);
        }
      },
      delay,
      { leading: true, trailing: false },
    );
  }, [pathname, delay]);
};
