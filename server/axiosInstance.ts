// server/axiosInstance.ts
import { userType } from '@/interfaces/user.type';
import { Dispatch } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { handleLogoutWithToast, handleTokenRefresh } from './auth.helper';
import { AUTH_STORAGE_KEYS } from './constants/auth.constants';
import { HttpService } from './utils/http.service';
import { StorageService } from './utils/storage.service';
import { TokenService } from './utils/token.service';

let isLoggingOut = false;

export const createAxios = (user: userType, dispatch: Dispatch, stateSuccess: any): AxiosInstance => {
  const newInstance = HttpService.createAuthenticatedInstance();

  newInstance.interceptors.request.use(
    async (config) => {
      if (isLoggingOut) {
        return Promise.reject(new Error('User is logging out'));
      }
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
            console.log('Token refreshed successfully');
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          console.error('Request interceptor error:', error);
          if (!isLoggingOut) {
            isLoggingOut = true;
            await handleLogoutWithToast();
          }
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
            console.log('Token refreshed successfully');
            return newInstance(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (err) {
          if (!isLoggingOut) {
            isLoggingOut = true;
            await StorageService.clearAuthData();
          }
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );

  return newInstance;
};

// Function để reset logout state khi user login lại
export const resetLogoutState = () => {
  isLoggingOut = false;
};
