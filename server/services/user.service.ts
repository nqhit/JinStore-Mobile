import { API_URL } from '@/constants/env';
import { userType } from '@/interfaces/user.type';
import { endpoints } from '@/server/constants/endpoints';
import axios, { AxiosInstance } from 'axios';
import { Alert } from 'react-native';

axios.defaults.baseURL = API_URL;

// FIXED: Added API response interface
interface userResponse {
  success: boolean;
  message: string;
  user: userType;
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  ...defaultHeaders,
});

export const getInfoUser = async (id: string, accessToken: string, axiosJWT: AxiosInstance): Promise<userType> => {
  try {
    if (!id || !accessToken) {
      throw new Error('Missing id or accessToken');
    }

    console.log('Fetching user info for ID:', id);

    const response = await axiosJWT.get(endpoints.infoUser + `/${id}`, {
      timeout: 10000,
      headers: authHeaders(accessToken),
    });

    // FIXED: Extract user from API response structure
    const apiResponse = response.data as userResponse;

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'API request failed');
    }

    return apiResponse.user;
  } catch (error) {
    console.log('Detailed error in getInfoUser:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Lỗi khi lấy thông tin người dùng';
      console.log('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: errorMessage,
      });
      Alert.alert('Lỗi', errorMessage);
      throw new Error(errorMessage);
    } else {
      const errorMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra khi lấy thông tin người dùng';
      console.log('Non-axios error:', errorMsg);
      Alert.alert('Lỗi', errorMsg);
      throw new Error(errorMsg);
    }
  }
};
