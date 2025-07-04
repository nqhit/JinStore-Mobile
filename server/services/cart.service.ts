import { API_URL } from '@/constants/env';
import { productToCartType } from '@/interfaces/product.type';
import { addFailed, addStart, addSuccess } from '@/redux/slices/itemCartSlice';
import { ENDPOINTS } from '@/server/constants/endpoints';
import axios, { AxiosInstance } from 'axios';
import { Dispatch } from 'redux';

axios.defaults.baseURL = API_URL;

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
  axiosJWT: AxiosInstance,
) => {
  dispatch(addStart());
  try {
    const res = await axiosJWT.post(ENDPOINTS.ADD_ITEM_TO_CART, formData, {
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

export const getCart = async (accessToken: string, axiosJWT: AxiosInstance) => {
  try {
    const response = await axiosJWT.get(ENDPOINTS.CARTS, {
      headers: authHeaders(accessToken),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateItemInCart = async (formData: productToCartType, accessToken: string, axiosJWT: AxiosInstance) => {
  try {
    const response = await axiosJWT.patch(ENDPOINTS.UPDATE_ITEM_IN_CART, formData, {
      headers: authHeaders(accessToken),
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật số lượng đơn hàng:', (error as Error).message);
  }
};

export const deleteItemInCart = async (id: string, accessToken: string, axiosJWT: AxiosInstance) => {
  try {
    const response = await axiosJWT.delete(ENDPOINTS.REMOVE_ITEM_IN_CART + `/${id}`, {
      headers: authHeaders(accessToken),
    });
    return response.data;
  } catch {
    console.log('Lỗi khi xóa đơn hàng');
  }
};
