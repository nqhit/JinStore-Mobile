// server/axiosInstance.ts
import { userType } from '@/interfaces/user.type';
import { Dispatch } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { handleLogoutWithToast, handleTokenRefresh } from './auth.helper';
import { AUTH_STORAGE_KEYS } from './constants/auth.constants';
import { HttpService } from './utils/http.service';
import { StorageService } from './utils/storage.service';
import { TokenService } from './utils/token.service';

export const createAxios = (user: userType, dispatch: Dispatch, stateSuccess: any): AxiosInstance => {
  const newInstance = HttpService.createAuthenticatedInstance();

  newInstance.interceptors.request.use(
    async (config) => {
      const accessToken = await StorageService.getItem<string>(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

      if (!accessToken) {
        return config;
      }

      if (TokenService.shouldRefreshToken(accessToken)) {
        try {
          const updatedUserData = await handleTokenRefresh(user, stateSuccess, dispatch);

          if (updatedUserData) {
            config.headers = config.headers || {};
            Object.assign(config.headers, HttpService.setAuthHeader(updatedUserData.accessToken));
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          console.error('Request interceptor error:', error);
          await handleLogoutWithToast();
          return Promise.reject(error);
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
          const updatedUserData = await handleTokenRefresh(user, stateSuccess, dispatch);

          if (updatedUserData) {
            originalRequest.headers = originalRequest.headers || {};
            Object.assign(originalRequest.headers, HttpService.setAuthHeader(updatedUserData.accessToken));

            return newInstance(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (err) {
          console.error('Response interceptor error:', err);
          await StorageService.clearAuthData();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );

  return newInstance;
};
