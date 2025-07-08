import { loginSuccess } from '@/redux/slices/authSlice';
import { checkAndHandleToken, handleLogout, validateAuthData } from '@/server/auth.helper';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function IndexPage() {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const { isValid, userData, accessToken } = await validateAuthData();

      if (!isValid || !userData || !accessToken) {
        await handleLogout();
        return;
      }

      // Check and handle token
      const { success, shouldNavigateToHome } = await checkAndHandleToken(
        userData,
        accessToken,
        dispatch,
        loginSuccess,
      );

      if (success && shouldNavigateToHome) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
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
