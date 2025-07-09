// utils/auth.utils.ts
import { userType } from '@/interfaces/user.type';
import { loginSuccess } from '@/redux/slices/authSlice';
import { AUTH_STORAGE_KEYS } from '@/server/constants/auth.constants';
import { StorageService } from '@/server/utils/storage.service';
import { TokenRefreshService } from '@/server/utils/token-refresh.service';
import { Dispatch } from '@reduxjs/toolkit';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { TokenService } from './utils/token.service';

export interface TokenRefreshCallbacks {
  onSuccess?: (updatedUser: userType) => void;
  onError?: () => void;
}
let isLoggingOut = false;
/**
 * Xử lý refresh token và cập nhật storage + redux state
 */
export const handleTokenRefresh = async (
  userData: userType,
  stateSuccess: any,
  dispatch: Dispatch,
): Promise<userType | null> => {
  if (isLoggingOut) {
    return null;
  }
  try {
    console.log('Đang refresh token...');
    const refreshData = await TokenRefreshService.refreshTokens();

    if (!refreshData || !refreshData.accessToken) {
      throw new Error('Invalid refresh data');
    }

    const updatedUserData: userType = {
      ...userData,
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken,
    };

    const tokens = {
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken,
    };

    // Cập nhật storage
    await StorageService.setItem(AUTH_STORAGE_KEYS.USER, updatedUserData);
    await StorageService.setAuthTokens(tokens);

    // Cập nhật redux state
    dispatch(stateSuccess(updatedUserData));

    return updatedUserData;
  } catch (error) {
    if (!isLoggingOut) {
      if (error === 'Không có refresh token') {
        await handleLogout();
      }
    }

    return null;
  }
};

/**
 * Xử lý logout và clear data với Toast
 */
export const handleLogoutWithToast = async (message?: string) => {
  if (isLoggingOut) return;

  isLoggingOut = true;
  try {
    Toast.show({
      type: 'info',
      text1: message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
      position: 'top',
      visibilityTime: 800,
    });
    await StorageService.clearAuthData();
    router.replace('/(auth)/login');
  } catch (error) {
    console.error('Logout error:', error);
    router.replace('/(auth)/login');
  } finally {
    // Reset state sau một khoảng thời gian
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000);
  }
};

/**
 * Xử lý logout không có Toast
 */
export const handleLogout = async () => {
  if (isLoggingOut) return;

  isLoggingOut = true;

  try {
    await StorageService.clearAuthData();
    router.replace('/(auth)/login');
  } catch (error) {
    console.error('Logout error:', error);
    router.replace('/(auth)/login');
  } finally {
    // Reset state sau một khoảng thời gian
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000);
  }
};

/**
 * Kiểm tra và xử lý token với fallback refresh
 */
export const checkAndHandleToken = async (
  userData: userType,
  accessToken: string,
  dispatch: Dispatch,
  stateSuccess: any,
): Promise<{ success: boolean; shouldNavigateToHome: boolean }> => {
  try {
    if (TokenService.shouldRefreshToken(accessToken)) {
      console.log('Access token đã hết hạn, thử refresh...');

      const updatedUserData = await handleTokenRefresh(userData, stateSuccess, dispatch);

      if (!updatedUserData) {
        if (!isLoggingOut) {
          await handleLogoutWithToast();
        }
        return { success: false, shouldNavigateToHome: false };
      }

      return { success: true, shouldNavigateToHome: true };
    } else {
      console.log('Token còn hợp lệ');
      dispatch(loginSuccess({ ...userData, accessToken }));
      return { success: true, shouldNavigateToHome: true };
    }
  } catch (tokenError) {
    console.error('Token validation error:', tokenError);

    // Fallback: thử refresh token
    try {
      const updatedUserData = await handleTokenRefresh(userData, stateSuccess, dispatch);

      if (!updatedUserData) {
        if (!isLoggingOut) {
          await handleLogoutWithToast();
        }
        return { success: false, shouldNavigateToHome: false };
      }

      return { success: true, shouldNavigateToHome: true };
    } catch (refreshError) {
      console.error('Fallback refresh failed:', refreshError);
      await handleLogout();
      return { success: false, shouldNavigateToHome: false };
    }
  }
};

/**
 * Validate auth data và kiểm tra token
 */
export const validateAuthData = async (): Promise<{
  isValid: boolean;
  userData?: userType;
  accessToken?: string;
}> => {
  try {
    const userData = await StorageService.getItem<userType>(AUTH_STORAGE_KEYS.USER);
    const accessToken = await StorageService.getItem<string>(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

    if (!userData || !accessToken) {
      return { isValid: false };
    }

    return { isValid: true, userData, accessToken };
  } catch (error) {
    console.error('Auth validation error:', error);
    return { isValid: false };
  }
};

export const resetLogoutState = () => {
  isLoggingOut = false;
};
