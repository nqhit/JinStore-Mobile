import { API_BASE_URL } from '@/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.defaults.baseURL = API_BASE_URL;

const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('Không có refresh token');
    }

    const res = await axios.post(`/mobile/refresh`, { refreshToken }, { withCredentials: true });

    // Lưu token mới vào AsyncStorage
    const { accessToken, refreshToken: newRefreshToken } = res.data;

    await AsyncStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
    }

    return res.data;
  } catch (err) {
    console.error('Refresh token error:', err);
    // Xóa tất cả auth data khi refresh thất bại
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'persist:root']);
    throw new Error('Phiên đăng nhập đã hết hạn');
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create();

  newInstance.interceptors.request.use(
    async (config) => {
      let accessToken = await AsyncStorage.getItem('accessToken');

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;

          // Kiểm tra token sắp hết hạn (trước 5 phút)
          if (decodedToken.exp < currentTime + 300) {
            try {
              const data = await refreshToken();
              accessToken = data.accessToken;

              // Cập nhật user state với token mới
              if (dispatch && stateSuccess) {
                dispatch(stateSuccess({ ...user, accessToken }));
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'persist:root']);
              return Promise.reject(new Error('Authentication failed'));
            }
          }
        } catch (err) {
          console.error('Token decode error:', err);
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'persist:root']);
          return Promise.reject(new Error('Invalid token'));
        }

        config.headers['Authorization'] = 'Bearer ' + accessToken;
      }

      return config;
    },
    (err) => Promise.reject(err),
  );

  // Response interceptor để xử lý 401 errors
  newInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const data = await refreshToken();
          const newAccessToken = data.accessToken;

          // Cập nhật header và retry request
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

          if (dispatch && stateSuccess) {
            dispatch(stateSuccess({ ...user, accessToken: newAccessToken }));
          }

          return newInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed on 401:', refreshError);
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'persist:root']);
          return Promise.reject(new Error('Authentication failed'));
        }
      }

      return Promise.reject(error);
    },
  );

  return newInstance;
};
