import { API_URL } from '@/constants/env';
import axios from 'axios';
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
      throw new Error(error);
    }
  },
};
