import { API_URL } from '@/constants/env';
import { userType } from '@/interfaces/user.type';
import { ENDPOINTS } from '@/server/constants/endpoints';
import axios, { AxiosInstance } from 'axios';
import { ErrorHandler } from './../../utils/error.handler';

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

export const getInfoUser = async (id: string, accessToken: string, axiosJWT: AxiosInstance) => {
  try {
    if (!id || !accessToken) {
      throw new Error('Missing id or accessToken');
    }

    const response = await axiosJWT.get(ENDPOINTS.INFO_USER + `/${id}`, {
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
    ErrorHandler.handleAuthError(error);
  }
};
