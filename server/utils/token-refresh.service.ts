import { AuthTokens } from '@/interfaces/auth.type';
import { AUTH_STORAGE_KEYS } from '../constants/auth.constants';
import { ENDPOINTS } from '../constants/endpoints';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';

export const TokenRefreshService = {
  async refreshTokens(): Promise<AuthTokens> {
    const refreshToken = await StorageService.getItem<string>(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error('Không có refresh token');
    }

    try {
      const httpClient = HttpService.getInstance();
      const response = await httpClient.post(ENDPOINTS.REFRESH, { refreshToken });

      await StorageService.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      if (response.data.refreshToken) {
        await StorageService.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }
      return response.data;
    } catch (error) {
      console.error('Refresh token failed:', error);
      await this.handleRefreshFailure();
      throw error;
    }
  },

  async handleRefreshFailure(): Promise<void> {
    try {
      await StorageService.clearAuthData();
      console.error('Phiên đăng nhập đã hết hạn');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
};
