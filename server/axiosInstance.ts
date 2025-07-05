import { userType } from '@/interfaces/user.type';
import { Dispatch } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { HttpService } from './utils/http.service';
import { StorageService } from './utils/storage.service';
import { TokenRefreshService } from './utils/token-refresh.service';
import { TokenService } from './utils/token.service';

export const createAxios = (user: userType, dispatch: Dispatch, stateSuccess: any): AxiosInstance => {
  const newInstance = HttpService.createAuthenticatedInstance();

  newInstance.interceptors.request.use(
    async (config) => {
      const accessToken = await StorageService.getItem<string>('accessToken');

      if (!accessToken) {
        return config;
      }

      if (TokenService.shouldRefreshToken(accessToken)) {
        try {
          console.log('Token sắp hết hạn, đang refresh...');
          const refreshData = await TokenRefreshService.refreshTokens();

          const updatedUserData = {
            ...user,
            accessToken: refreshData.accessToken,
          };

          await StorageService.setItem('user', updatedUserData);
          dispatch(stateSuccess(updatedUserData));

          config.headers = config.headers || {};
          Object.assign(config.headers, HttpService.setAuthHeader(accessToken));
        } catch {
          Toast.show({
            type: 'info',
            text1: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
            position: 'bottom',
            visibilityTime: 800,
          });
          router.push('/(auth)/login');
        }
      } else {
        config.headers = config.headers || {};
        Object.assign(config.headers, HttpService.setAuthHeader(accessToken));
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
          const data = await TokenRefreshService.refreshTokens();
          const newAccessToken = data.accessToken;

          dispatch(stateSuccess({ ...user, accessToken: newAccessToken }));
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return newInstance(originalRequest);
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
