import { AuthTokens } from '@/interfaces/auth.type';
import { userType } from '@/interfaces/user.type';
import { AUTH_STORAGE_KEYS } from '../constants/auth.constants';
import { ENDPOINTS } from '../constants/endpoints';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';

export const TokenRefreshService = {
  async refreshTokens(): Promise<AuthTokens> {
    const userData = await StorageService.getItem<userType>(AUTH_STORAGE_KEYS.USER);
    const refreshToken = userData?.refreshToken as string;

    if (!refreshToken) {
      throw new Error('Không có refresh token');
    }

    try {
      const httpClient = HttpService.getInstance();
      const response = await httpClient.post(ENDPOINTS.REFRESH, { refreshToken });

      if (!response.data || !response.data.accessToken) {
        console.error('Response không hợp lệ:', response.data);
        throw new Error('Response không hợp lệ từ server');
      }

      console.log('Refresh token thành công');
      await StorageService.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      if (response.data.refreshToken) {
        await StorageService.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }
      return response.data;
    } catch (error: any) {
      console.error('Refresh token failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });

      // Kiểm tra loại lỗi cụ thể
      if (error.response?.status === 401) {
        console.error('Refresh token đã hết hạn hoặc không hợp lệ');
        await this.handleRefreshFailure();
        throw new Error('Refresh token đã hết hạn');
      } else if (error.response?.status === 500) {
        console.error('Lỗi server khi refresh token');
        throw new Error('Lỗi server');
      } else if (error.code === 'NETWORK_ERROR') {
        console.error('Lỗi kết nối mạng');
        throw new Error('Lỗi kết nối mạng');
      } else if (error.response?.status === 403) {
        console.error('Refresh token không hợp lệ');
        throw new Error('Refresh token không hợp lệ');
      }

      await this.handleRefreshFailure();
      throw error;
    }
  },

  async handleRefreshFailure(): Promise<void> {
    try {
      console.log('Xóa dữ liệu auth do refresh token thất bại');
      await StorageService.clearAuthData();
      console.error('Phiên đăng nhập đã hết hạn');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
};
