// app/index.tsx
import { API_BASE_URL } from '@/config/config';
import { loginSuccess } from '@/redux/authSlice'; // Import action để restore state
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function IndexPage() {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  axios.defaults.baseURL = API_BASE_URL;

  const refreshToken = async () => {
    try {
      const token = await AsyncStorage.getItem('refreshToken');

      if (!token) {
        throw new Error('Không có refresh token');
      }

      const refreshToken = JSON.parse(token);

      const res = await axios.post(
        `/mobile/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      // Lưu token mới vào AsyncStorage
      const { accessToken, refreshToken: newRefreshToken } = res.data;

      await AsyncStorage.setItem('accessToken', JSON.stringify(accessToken));
      if (newRefreshToken) {
        await AsyncStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));
      }

      return res.data;
    } catch (err) {
      console.error('Refresh token error:', err);
      // Xóa tất cả auth data khi refresh thất bại
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'persist:root', 'user']);
      throw new Error('Phiên đăng nhập đã hết hạn');
    }
  };

  // Kiểm tra và validate token
  const checkAuthStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedAccessToken = await AsyncStorage.getItem('accessToken');

      if (!storedUser || !storedAccessToken) {
        router.replace('/(auth)/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      const accessToken = JSON.parse(storedAccessToken);

      try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        if (!decodedToken || typeof decodedToken.exp !== 'number') {
          throw new Error('Invalid token format');
        }

        // 3. Kiểm tra token có hết hạn không
        if (decodedToken.exp <= currentTime) {
          console.log('Access token đã hết hạn, thử refresh...');

          const refreshData = await refreshToken();

          const updatedUserData = {
            ...userData,
            accessToken: refreshData.accessToken,
          };

          await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
          dispatch(loginSuccess(updatedUserData));

          router.replace('/(tabs)/home');
        } else {
          // Token còn hợp lệ
          console.log('Token còn hợp lệ');

          // Restore Redux state
          dispatch(loginSuccess({ ...userData, accessToken }));

          // Điều hướng đến tabs
          router.replace('/(tabs)/home');
        }
      } catch (tokenError) {
        console.error('Token validation error:', tokenError);

        // Thử refresh token as fallback
        try {
          const refreshData = await refreshToken();
          const updatedUserData = {
            ...userData,
            accessToken: refreshData.accessToken,
          };

          await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
          dispatch(loginSuccess(updatedUserData));
          router.replace('/(tabs)/home');
        } catch (refreshError) {
          console.error('Fallback refresh failed:', refreshError);
          router.replace('/(auth)/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Có lỗi → xóa data và về login
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      router.replace('/(auth)/login');
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
