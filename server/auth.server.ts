import { API_URL } from '@/constants/env';
import { userType } from '@/interfaces/user.type';
import axios, { AxiosInstance } from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';
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
} from '../redux/slices/authSlice';

axios.defaults.baseURL = API_URL;

interface loginFormData {
  usernameOrEmail: string;
  password: string;
}

interface registerFormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  ...defaultHeaders,
});

export const login = async (user: loginFormData, dispatch: Dispatch): Promise<userType> => {
  dispatch(loginStart());
  try {
    const res = await axios.post<userType>(`/mobile/login`, user);

    // FIXED: Response is direct user object, not wrapped in data
    if (res.data && res.data._id) {
      dispatch(loginSuccess(res.data));
      console.log('Đăng nhập thành công!');
      return res.data;
    } else {
      throw new Error('Phản hồi từ server không hợp lệ');
    }
  } catch (error) {
    dispatch(loginFailed());

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      Alert.alert('Lỗi', errorMessage);
      throw new Error(errorMessage);
    } else {
      const errorMsg = 'Có lỗi xảy ra khi đăng nhập';
      Alert.alert('Lỗi', errorMsg);
      throw new Error(errorMsg);
    }
  }
};

export const logOut = async (dispatch: Dispatch, id: string, accessToken: string, axiosJWT: AxiosInstance) => {
  dispatch(logoutStart());
  try {
    const res = await axiosJWT.post(
      `/mobile/logout`,
      { userId: id },
      {
        headers: authHeaders(accessToken),
      },
    );
    dispatch(logoutSuccess());
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Logout error:', error.response?.data?.message);
      Alert.alert('Lỗi', 'Đăng xuất thất bại');
    }
    dispatch(logoutFailed());
    throw error;
  }
};

export const register = async (user: registerFormData, dispatch: Dispatch) => {
  if (user.password !== user.confirmPassword) {
    Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
    return;
  }
  dispatch(registerStart());
  try {
    const res = await axios.post(`/auth/register`, user);

    if (res.data) {
      dispatch(registerSuccess());
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
      router.replace('/login');
    } else {
      throw new Error('Đăng ký thất bại');
    }
  } catch (error) {
    dispatch(registerFailed());

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
      Alert.alert('Lỗi', errorMessage);
      throw new Error(errorMessage);
    } else {
      const errorMsg = 'Có lỗi xảy ra khi đăng ký';
      Alert.alert('Lỗi', errorMsg);
      throw new Error(errorMsg);
    }
  }
};
