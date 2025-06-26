import { API_BASE_URL } from '@/config/config';
import { productType } from '@/interfaces/product.type';
import axios from 'axios';

axios.defaults.baseURL = API_BASE_URL;

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
    const response = await axios.get(`/products?page=${page}&size=${limit}`, {
      timeout: 10000,
      headers: defaultHeaders,
    });

    return response.data;
  } catch (error: string | any) {
    throw new Error(error);
  }
};
