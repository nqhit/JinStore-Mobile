import { API_URL } from '@/constants/env';
import { endpoints } from '@/server/constants/endpoints';
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

export const getCategoriesAll = async () => {
  try {
    const response = await axios.get(endpoints.categoriesAll, {
      timeout: 10000,
      headers: defaultHeaders,
    });

    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};
