import { API_URL } from '@/constants/env';
import { loginFormData, registerFormData } from '@/interfaces/auth.type';
import { userType } from '@/interfaces/user.type';
import { ENDPOINTS } from '@/server/constants/endpoints';
import { ErrorHandler } from '@/utils/error.handler';
import { ValidationUtils } from '@/utils/validation';
import axios from 'axios';
import { router } from 'expo-router';
import { Dispatch } from 'redux';
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from '../../redux/slices/authSlice';
import { AUTH_STORAGE_KEYS } from '../constants/auth.constants';
import { HttpService } from '../utils/http.service';
import { StorageService } from '../utils/storage.service';

axios.defaults.baseURL = API_URL;

export const AuthService = {
  login: async (user: loginFormData, dispatch: Dispatch) => {
    const validationError = ValidationUtils.validateLoginForm(user);
    if (validationError) {
      ErrorHandler.showError(validationError);
      throw new Error(validationError);
    }
    dispatch(loginStart());
    try {
      const httpClient = HttpService.getInstance();
      const res = await httpClient.post<userType>(ENDPOINTS.LOGIN, user);

      if (!res.data || !res.data._id) {
        throw new Error('Phản hồi từ server không hợp lệ');
      }

      const tokens = {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      };

      await StorageService.setItem(AUTH_STORAGE_KEYS.USER, res.data);
      await StorageService.setAuthTokens(tokens);

      dispatch(loginSuccess(res.data));
      console.log('Đăng nhập thành công!');

      router.replace('/(tabs)/home');
    } catch (error) {
      dispatch(loginFailed());

      const errorMessage = ErrorHandler.handleAuthError(error);
      throw new Error(errorMessage);
    }
  },

  logOut: async (dispatch: Dispatch, id: string) => {
    dispatch(logoutStart());
    try {
      const httpClient = HttpService.getInstance();
      const res = await httpClient.post(ENDPOINTS.LOGOUT, { userId: id });
      if (res.data.success) {
        console.log(res.data.message);
        dispatch(logoutSuccess());
        router.replace('/(auth)/login');
        await StorageService.clearAuthData();
      }
      return res.data;
    } catch (error) {
      dispatch(logoutFailed());
      throw error;
    }
  },

  register: async (user: registerFormData, dispatch: Dispatch) => {
    const validationError = ValidationUtils.validateRegisterForm(user);
    if (validationError) {
      ErrorHandler.showError(validationError);
      return;
    }

    dispatch(registerStart());
    try {
      const httpClient = HttpService.getInstance();
      const res = await httpClient.post(ENDPOINTS.REGISTER, user);

      if (!res.data) {
        throw new Error('Đăng ký thất bại');
      }
      dispatch(registerSuccess());
      ErrorHandler.showSuccess('Đăng ký tài khoản thành công!');
      router.replace('/login');
    } catch (error) {
      dispatch(registerFailed());
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },

  sendOtp: async (email: string) => {
    try {
      const httpClient = HttpService.getInstance();
      await httpClient.post(ENDPOINTS.SEND_OTP, { email });
    } catch (error) {
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      const httpClient = HttpService.getInstance();
      await httpClient.post(ENDPOINTS.VERIFY_OTP, { email, otp });
    } catch (error) {
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },

  resetPassword: async (email: string, password: string, confirmPassword: string) => {
    try {
      const httpClient = HttpService.getInstance();
      await httpClient.patch(ENDPOINTS.RESET_PASSWORD, { email, password, confirmPassword });
    } catch (error) {
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },
};
