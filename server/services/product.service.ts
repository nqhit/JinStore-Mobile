import { API_URL } from '@/constants/env';
import { ErrorHandler } from '@/utils/error.handler';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { ENDPOINTS } from '../constants/endpoints';
import { HttpService } from '../utils/http.service';

axios.defaults.baseURL = API_URL;

export const productService = {
  getProductsAll: async (page: number, limit: number) => {
    try {
      const httpClient = HttpService.getInstance();
      const response = await httpClient.get(ENDPOINTS.PRODUCTS_ALL + `?page=${page}&size=${limit}`, {
        timeout: 10000,
      });

      return response.data;
    } catch (error: string | any) {
      ErrorHandler.handleAuthError(error);
    }
  },

  getProdDetail: async (id: string) => {
    if (!id) {
      return Toast.show({
        type: 'info',
        text1: 'Vui lòng thử lại',
      });
    }
    try {
      const httpClient = HttpService.getInstance();
      const response = await httpClient.get(ENDPOINTS.PRODUCT_DETAIL(id));
      return response.data;
    } catch (error: string | any) {
      ErrorHandler.handleAuthError(error);
    }
  },
};
