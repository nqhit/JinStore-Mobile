import { API_URL } from '@/constants/env';
import { userType } from '@/interfaces/user.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';

axios.defaults.baseURL = API_URL;

const refreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem('refreshToken');

    if (!token) {
      throw new Error('Không có refresh token');
    }

    const refreshToken = JSON.parse(token);

    const res = await axios.post(`/mobile/refresh`, { refreshToken });

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
    console.error('Phiên đăng nhập đã hết hạn');
  }
};

export const createAxios = (user: userType, dispatch: Dispatch, stateSuccess: any) => {
  const newInstance = axios.create();

  newInstance.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        return config;
      }

      let accessToken = JSON.parse(token);
      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);

        if (!decodedToken || typeof decodedToken.exp !== 'number') {
          throw new Error('Invalid token format');
        }

        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime + 300) {
          try {
            console.log('Token sắp hết hạn, đang refresh...');
            const refreshData = await refreshToken();

            const updatedUserData = {
              ...user,
              accessToken: refreshData.accessToken,
            };

            await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
            dispatch(stateSuccess(updatedUserData));

            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          } catch {
            Toast.show({
              type: 'info',
              text1: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
              position: 'bottom',
              visibilityTime: 800,
            });
            router.push('/(auth)/login');
          }
        }
      }
      return config;
    },
    (err) => Promise.reject(err.message),
  );

  newInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const data = await refreshToken();
          const newAccessToken = data.accessToken;

          dispatch(stateSuccess({ ...user, accessToken: newAccessToken }));
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return newInstance(originalRequest); // gửi lại request cũ
        } catch (err) {
          console.error('Lỗi khi refresh token:', err);
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );
  return newInstance;
};
