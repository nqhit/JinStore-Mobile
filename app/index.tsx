// app/index.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function IndexPage() {
  const isAuthenticated = useSelector((state: any) => state?.auth?.login?.currentUser);

  useEffect(() => {
    // Đợi một chút để Redux store được hydrate từ persist
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);
}
