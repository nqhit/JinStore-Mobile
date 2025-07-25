import { AddressFormValues } from '@/interfaces/address.type';
import { ErrorHandler } from '@/utils/error.handler';
import { AxiosInstance } from 'axios';
import { handleLogout } from '../auth.helper';
import { ENDPOINTS } from '../constants/endpoints';
import { HttpService } from '../utils/http.service';

export const AddressService = {
  getCustomerAddress: async (axiosJWT: AxiosInstance, accessToken: string) => {
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

  actionsAddress: async (formData: AddressFormValues, accessToken: string, axiosJWT: AxiosInstance, id?: string) => {
    if (!accessToken) {
      return handleLogout();
    }
    let response = null;
    try {
      if (id) {
        response = await axiosJWT.put(ENDPOINTS.UPDATE_ADDRESS_CUSTOMER(id), formData, {
          ...HttpService.setAuthHeader(accessToken),
        });
        console.log('id: ', id);
      } else {
        response = await axiosJWT.post(ENDPOINTS.ADD_ADDRESS_CUSTOMER, formData, {
          ...HttpService.setAuthHeader(accessToken),
        });
      }
      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
    }
  },

  // updateAddress: async (id: string, formData: AddressFormValues, accessToken: string, axiosJWT: AxiosInstance) => {
  //   if (!accessToken) {
  //     return handleLogout();
  //   }
  //   try {
  //     const response = await axiosJWT.put(ENDPOINTS.UPDATE_ADDRESS_CUSTOMER(id), formData, {
  //       ...HttpService.setAuthHeader(accessToken),
  //     });
  //     return response.data;
  //   } catch (error) {
  //     ErrorHandler.handleAuthError(error);
  //   }
  // },

  deleteAddress: async (id: string, accessToken: string, axiosJWT: AxiosInstance) => {
    if (!accessToken) {
      return handleLogout();
    }
    try {
      const response = await axiosJWT.delete(ENDPOINTS.DELETE_ADDRESS_CUSTOMER(id), {
        ...HttpService.setAuthHeader(accessToken),
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handleAuthError(error);
    }
  },
};
