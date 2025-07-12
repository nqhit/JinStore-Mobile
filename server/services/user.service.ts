import { API_URL } from '@/constants/env';
import { ProfileFormValues } from '@/interfaces/user.type';
import { loginSuccess } from '@/redux/slices/authSlice';
import { ENDPOINTS } from '@/server/constants/endpoints';
import { Dispatch } from '@reduxjs/toolkit';
import axios, { AxiosInstance } from 'axios';
import { HttpService } from '../utils/http.service';
import { ErrorHandler } from './../../utils/error.handler';

axios.defaults.baseURL = API_URL;

export const userService = {
  getInfoUser: async (id: string, accessToken: string, axiosJWT: AxiosInstance) => {
    try {
      if (!id || !accessToken) {
        throw new Error('Có lỗi xảy ra vui lòng thử lại!');
      }

      const response = await axiosJWT.get(ENDPOINTS.INFO_USER(id), {
        timeout: 10000,
        ...HttpService.setAuthHeader(accessToken),
      });

      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },

  updateInfoUser: async (
    formData: ProfileFormValues,
    accessToken: string,
    axiosJWT: AxiosInstance,
    dispatch: Dispatch,
  ) => {
    try {
      const response = await axiosJWT.patch(ENDPOINTS.UPDATE_INFO_USER, formData, {
        ...HttpService.setAuthHeader(accessToken),
      });
      dispatch(loginSuccess(response.data.user));
      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },
};
