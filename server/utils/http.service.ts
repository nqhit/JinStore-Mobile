import { API_URL } from '@/constants/env';
import axios, { AxiosInstance } from 'axios';
let instance: AxiosInstance | null = null;

export const HttpService = {
  getInstance(): AxiosInstance {
    if (!instance) {
      instance = axios.create({
        baseURL: API_URL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const { config } = error;
          if (!config || config._retry) {
            return Promise.reject(error);
          }

          config._retry = true;

          if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
            console.log('Retrying request due to network error...');
            if (instance) {
              return instance.request(config);
            }
          }

          return Promise.reject(error);
        },
      );
    }
    return instance;
  },

  createAuthenticatedInstance(): AxiosInstance {
    return axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  },

  setAuthHeader(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  },
};
