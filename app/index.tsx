import { userType } from '@/interfaces/user.type';
import { handleLogout } from '@/server/auth.helper';
import { AUTH_STORAGE_KEYS } from '@/server/constants/auth.constants';
import { StorageService } from '@/server/utils/storage.service';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexPage() {
  const [isChecking, setIsChecking] = useState(true);

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
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
}
