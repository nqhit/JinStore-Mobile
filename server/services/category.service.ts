import { API_URL } from '@/constants/env';
import { ENDPOINTS } from '@/server/constants/endpoints';
import { ErrorHandler } from '@/utils/error.handler';
import axios from 'axios';
import { HttpService } from '../utils/http.service';

axios.defaults.baseURL = API_URL;

export const categoryService = {
  getCategoriesAll: async () => {
    try {
      const httpClient = HttpService.getInstance();
      const response = await httpClient.get(ENDPOINTS.CATEGORIES_ALL, {
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
    }
  },
};
