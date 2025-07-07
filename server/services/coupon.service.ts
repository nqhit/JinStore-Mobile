import { ErrorHandler } from '@/utils/error.handler';
import { AxiosInstance } from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { HttpService } from '../utils/http.service';

export const couponService = {
  getAllDiscountUser: async (id: string, axiosJWT: AxiosInstance, accessToken: string) => {
    try {
      const res = await axiosJWT.get(ENDPOINTS.ALL_COUPONS_BY_USER(id), { ...HttpService.setAuthHeader(accessToken) });
      return res.data;
    } catch (error: any) {
      console.log('Lỗi khi lấy danh sách coupon:', error.message);
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },
};
