import { updateItemInCart } from '@/server/services/cart.service';
import { AxiosInstance } from 'axios';
import { useCallback } from 'react';

interface UseChangeQuantityParams {
  accessToken: string;
  axiosJWT: AxiosInstance;
}

function useChangeQuantity({ accessToken, axiosJWT }: UseChangeQuantityParams) {
  const fetchQuantityChange = useCallback(
    async (itemId: string, change: number, oldQuantity: number) => {
      const newQuantity = oldQuantity + change;
      if (newQuantity < 1) return;

      const formData = {
        productId: itemId,
        quantity: newQuantity,
      };

      try {
        const response = await updateItemInCart(formData, accessToken, axiosJWT);

        return response;
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    [accessToken, axiosJWT],
  );

  return { fetchQuantityChange };
}

export default useChangeQuantity;
