import { userType } from '@/interfaces/user.type';
import { handleLogout } from '@/server/auth.helper';
import { AUTH_STORAGE_KEYS } from '@/server/constants/auth.constants';
import { StorageService } from '@/server/utils/storage.service';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function IndexPage() {
  const checkAuthStatus = async () => {
    try {
      const userData = await StorageService.getItem<userType>(AUTH_STORAGE_KEYS.USER);
      if (!userData) {
        await handleLogout();
        return;
      }

      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Auth check error:', error);
      await handleLogout();
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);
  return null;
}
