import { API_URL } from '@/constants/env';
import { loginFormData, registerFormData } from '@/interfaces/auth.type';
import { userType } from '@/interfaces/user.type';
import { ENDPOINTS } from '@/server/constants/endpoints';
import { ErrorHandler } from '@/utils/error.handler';
import { ValidationUtils } from '@/utils/validation';
import axios, { AxiosInstance } from 'axios';
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
import { HttpService } from '../utils/http.service';
import { StorageService } from '../utils/storage.service';

axios.defaults.baseURL = API_URL;

export const login = async (user: loginFormData, dispatch: Dispatch) => {
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

    await StorageService.setItem('user', res.data);
    await StorageService.setAuthTokens(tokens);

    dispatch(loginSuccess(res.data));
    console.log('Đăng nhập thành công!');

    router.replace('/(tabs)/home');
  } catch (error) {
    dispatch(loginFailed());

    const errorMessage = ErrorHandler.handleAuthError(error);
    throw new Error(errorMessage);
  }
};

export const logOut = async (dispatch: Dispatch, id: string, accessToken: string, axiosJWT: AxiosInstance) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post(
      ENDPOINTS.LOGOUT,
      { userId: id },
      {
        headers: HttpService.setAuthHeader(accessToken),
      },
    );
    await StorageService.clearAuthData();
    dispatch(logoutSuccess());
    router.replace('/(auth)/login');
  } catch (error) {
    dispatch(logoutFailed());
    ErrorHandler.handleAuthError(error);
    throw error;
  }
};

export const register = async (user: registerFormData, dispatch: Dispatch) => {
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
};
