import { API_URL } from '@/constants/env';
import axios, { AxiosInstance } from 'axios';
let instance: AxiosInstance | null = null;

export const HttpService = {
  getInstance(): AxiosInstance {
    if (!instance) {
      instance = axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    }
    return instance;
  },

  createAuthenticatedInstance(): AxiosInstance {
    return axios.create({
      baseURL: API_URL,
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
