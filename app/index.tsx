// app/index.tsx
import { loginSuccess } from '@/redux/slices/authSlice'; // Import action để restore state
import { AUTH_STORAGE_KEYS } from '@/server/constants/auth.constants';
import { StorageService } from '@/server/utils/storage.service';
import { TokenRefreshService } from '@/server/utils/token-refresh.service';
import { TokenService } from '@/server/utils/token.service';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function IndexPage() {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  // Kiểm tra và validate token
  const checkAuthStatus = async () => {
    try {
      const userData = await StorageService.getItem('user');
      const accessToken = await StorageService.getItem<string>(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

      if (!userData || !accessToken) {
        router.replace('/(auth)/login');
        return;
      }

      try {
        if (TokenService.shouldRefreshToken(accessToken)) {
          console.log('Access token đã hết hạn, thử refresh...');

          const refreshData = await TokenRefreshService.refreshTokens();

          if (!refreshData || !refreshData.accessToken) {
            console.error('Refresh token failed');
            await StorageService.clearAuthData();
            router.replace('/(auth)/login');
            return;
          }

          const updatedUserData = {
            ...userData,
            accessToken: refreshData.accessToken,
          };

          await StorageService.setItem('user', updatedUserData);
          dispatch(loginSuccess(updatedUserData));

          router.replace('/(tabs)/home');
        } else {
          console.log('Token còn hợp lệ');
          dispatch(loginSuccess({ ...userData, accessToken }));
          router.replace('/(tabs)/home');
        }
      } catch (tokenError) {
        console.error('Token validation error:', tokenError);

        try {
          const refreshData = await TokenRefreshService.refreshTokens();
          if (!refreshData || !refreshData.accessToken) {
            console.error('Refresh token failed or returned invalid data');
          }
          const updatedUserData = {
            ...userData,
            accessToken: refreshData.accessToken,
          };

          await StorageService.setItem('user', updatedUserData);
          dispatch(loginSuccess(updatedUserData));
          router.replace('/(tabs)/home');
        } catch (refreshError) {
          console.error('Fallback refresh failed:', refreshError);
          router.replace('/(auth)/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await StorageService.clearAuthData();
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Hiển thị loading trong khi kiểm tra
  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
}
