import { api_url } from '@/config';
import axios from 'axios';

axios.defaults.baseURL = api_url;

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
    const response = await axios.get(`/categories`, {
      timeout: 10000,
      headers: defaultHeaders,
    });

    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};
