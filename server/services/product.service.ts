import { API_URL } from '@/constants/env';
import { productType } from '@/interfaces/product.type';
import { ENDPOINTS } from '@/server/constants/endpoints';
import axios from 'axios';

axios.defaults.baseURL = API_URL;

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  ...defaultHeaders,
});

// NOTE: Lấy danh sách sản phẩm
export const getProductsAll = async (page: number, limit: number): Promise<productType[]> => {
  try {
    const response = await axios.get(ENDPOINTS.PRODUCTS_ALL + `?page=${page}&size=${limit}`, {
      timeout: 10000,
      headers: defaultHeaders,
    });

    return response.data;
  } catch (error: string | any) {
    throw new Error(error);
  }
};
