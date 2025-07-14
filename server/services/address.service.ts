import { ErrorHandler } from '@/utils/error.handler';
import { AxiosInstance } from 'axios';
import { handleLogout } from '../auth.helper';
import { ENDPOINTS } from '../constants/endpoints';
import { HttpService } from '../utils/http.service';

export const AddressService = {
  getAllAddress: async (axiosJWT: AxiosInstance, accessToken: string) => {
    if (!accessToken) {
      return handleLogout();
    }
    try {
      const response = await axiosJWT.get(ENDPOINTS.ADDRESS_USER, { ...HttpService.setAuthHeader(accessToken) });
      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
    }
  },
};
