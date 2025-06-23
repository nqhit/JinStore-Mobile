import { API_BASE_URL } from '@/config/config';
import { productToCartType } from '@/interfaces/product.type';
import { addFailed, addStart, addSuccess } from '@/redux/slices/itemCartSlice';
import axios from 'axios';
import { Dispatch } from 'redux';

axios.defaults.baseURL = API_BASE_URL;

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  ...defaultHeaders,
});

export const addItemToCart = async (
  formData: productToCartType,
  dispatch: Dispatch,
  accessToken: string,
  axiosJWT: any,
) => {
  dispatch(addStart());
  try {
    const res = await axiosJWT.post('/carts/add', formData, {
      headers: authHeaders(accessToken),
    });
    if (res.data.success) {
      dispatch(addSuccess(res.data));
      console.log('Message of add item to cart:', res.data.message);
      return res.data;
    }
  } catch (error: string | any) {
    const errorMessage = error.response?.data?.message || 'Lỗi hệ thống!';
    dispatch(addFailed(errorMessage));
    throw error;
  }
};

export const getCart = async (accessToken: string, axiosJWT: any) => {
  try {
    const response = await axiosJWT.get(`/carts`, {
      headers: authHeaders(accessToken),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
