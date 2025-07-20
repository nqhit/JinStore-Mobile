import { API_URL } from '@/constants/env';
import { productToCartType } from '@/interfaces/product.type';
import { addFailed, addStart, addSuccess } from '@/redux/slices/itemCartSlice';
import { ENDPOINTS } from '@/server/constants/endpoints';
import { ErrorHandler } from '@/utils/error.handler';
import axios, { AxiosInstance } from 'axios';
import { Dispatch } from 'redux';
import { HttpService } from '../utils/http.service';

axios.defaults.baseURL = API_URL;

export const CartService = {
  addItemToCart: async (
    formData: productToCartType,
    dispatch: Dispatch,
    accessToken: string,
    axiosJWT: AxiosInstance,
  ) => {
    dispatch(addStart());
    try {
      const res = await axiosJWT.post(ENDPOINTS.ADD_ITEM_TO_CART, formData, {
        ...HttpService.setAuthHeader(accessToken),
      });
      if (res.data.success) {
        dispatch(addSuccess(res.data));
        return res.data;
      }
    } catch (error: string | any) {
      const errorMessage = error.response?.data?.message || 'Lỗi hệ thống!';
      dispatch(addFailed(errorMessage));
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },

  getCart: async (accessToken: string, axiosJWT: AxiosInstance) => {
    try {
      const response = await axiosJWT.get(ENDPOINTS.CARTS, {
        ...HttpService.setAuthHeader(accessToken),
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },

  updateItemInCart: async (formData: productToCartType, accessToken: string, axiosJWT: AxiosInstance) => {
    try {
      const response = await axiosJWT.patch(ENDPOINTS.UPDATE_ITEM_IN_CART, formData, {
        ...HttpService.setAuthHeader(accessToken),
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },

  deleteItemInCart: async (id: string, accessToken: string, axiosJWT: AxiosInstance) => {
    try {
      const response = await axiosJWT.delete(ENDPOINTS.REMOVE_ITEM_IN_CART(id), {
        ...HttpService.setAuthHeader(accessToken),
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
      throw error;
    }
  },
};
