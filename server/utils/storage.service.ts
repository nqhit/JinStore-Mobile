import { AuthTokens } from '@/interfaces/auth.type';
import { AUTH_STORAGE_KEYS } from '@/server/constants/auth.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting storage item:', error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting storage item:', error);
      return null;
    }
  },
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEYS.ACCESS_TOKEN,
        AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        AUTH_STORAGE_KEYS.USER,
        AUTH_STORAGE_KEYS.PERSIST_ROOT,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
  async setAuthTokens(tokens: AuthTokens): Promise<void> {
    await Promise.all([
      this.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      this.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
    ]);
  },
  async getAuthTokens(): Promise<AuthTokens | null> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getItem<string>(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
      this.getItem<string>(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
    ]);

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  },
};
