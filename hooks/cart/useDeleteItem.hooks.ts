import { deleteItemInCart } from '@/server/cart.server';
import { AxiosInstance } from 'axios';
import { useCallback } from 'react';

interface UseParams {
  accessToken: string;
  axiosJWT: AxiosInstance;
}

function useDeleteItem({ accessToken, axiosJWT }: UseParams) {
  const fetchDeleteItem = useCallback(
    async (itemId: string) => {
      try {
        const response = await deleteItemInCart(itemId, accessToken, axiosJWT);

        return response;
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    [accessToken, axiosJWT],
  );

  return { fetchDeleteItem };
}

export default useDeleteItem;
