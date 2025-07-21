import { userType } from '@/interfaces/user.type';
import { Dispatch } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { handleLogout, handleTokenRefresh } from './auth.helper';
import { AUTH_STORAGE_KEYS } from './constants/auth.constants';
import { HttpService } from './utils/http.service';
import { StorageService } from './utils/storage.service';

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token as string);
    }
  });
  failedQueue = [];
};

export const createAxios = (user: userType, dispatch: Dispatch, stateSuccess: any): AxiosInstance => {
  const instance = HttpService.createAuthenticatedInstance();
  instance.defaults.timeout = 10000;

  instance.interceptors.request.use(
    async (config) => {
      const accessToken = await StorageService.getItem<string>(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        config.headers = config.headers || {};
        Object.assign(config.headers, HttpService.setAuthHeader(accessToken));
      }
      return config;
    },
    (err) => Promise.reject(err),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers = originalRequest.headers || {};
              Object.assign(originalRequest.headers, HttpService.setAuthHeader(token as string));
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const updatedUserData = await handleTokenRefresh(user, stateSuccess, dispatch);

          if (updatedUserData) {
            user.accessToken = updatedUserData.accessToken;
            user.refreshToken = updatedUserData.refreshToken;

            originalRequest.headers = {
              ...originalRequest.headers,
              ...HttpService.setAuthHeader(updatedUserData.accessToken),
            };

            processQueue(null, updatedUserData.accessToken);
            return instance(originalRequest);
          } else {
            processQueue(new Error('Token refresh failed'), null);
            await handleLogout();
            throw new Error('Token refresh failed');
          }
        } catch (err) {
          processQueue(err, null);
          await handleLogout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};
