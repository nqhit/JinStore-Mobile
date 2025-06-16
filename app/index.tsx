// app/index.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function IndexPage() {
  const user = useSelector((state: any) => state.auth.login.currentUser);

  // Điều hướng sang (tabs) nếu user đã login
  useEffect(() => {
    if (user && user._id) {
      router.replace('/(tabs)');
    }
  }, [user]);
}
