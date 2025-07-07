import { API_URL } from '@/constants/env';
import { ENDPOINTS } from '@/server/constants/endpoints';
import axios, { AxiosInstance } from 'axios';
import { HttpService } from '../utils/http.service';
import { ErrorHandler } from './../../utils/error.handler';

axios.defaults.baseURL = API_URL;

export const userService = {
  getInfoUser: async (id: string, accessToken: string, axiosJWT: AxiosInstance) => {
    try {
      if (!id || !accessToken) {
        throw new Error('Missing id or accessToken');
      }

      const response = await axiosJWT.get(ENDPOINTS.INFO_USER + `/${id}`, {
        timeout: 10000,
        ...HttpService.setAuthHeader(accessToken),
      });

      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
    }
  },
};
