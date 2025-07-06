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

    const httpClient = HttpService.getInstance();
    const response = await httpClient.post(ENDPOINTS.REFRESH, { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    const tokens: AuthTokens = {
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
    };

    await StorageService.setAuthTokens(tokens);
    return tokens;
  },
  async handleRefreshFailure(): Promise<void> {
    await StorageService.clearAuthData();
    console.error('Phiên đăng nhập đã hết hạn');
  },
};
