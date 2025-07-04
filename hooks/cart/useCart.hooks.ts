// hooks/useCart.ts
import { getCart } from '@/server/services/cart.service';
import { AxiosInstance } from 'axios';
import { useCallback } from 'react';

interface UseCartParams {
  accessToken: string;
  axiosJWT: AxiosInstance;
}

function useCart({ accessToken, axiosJWT }: UseCartParams) {
  const fetchCartItems = useCallback(async () => {
    try {
      const res = await getCart(accessToken, axiosJWT);
      return res;
    } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
      return null;
    }
  }, []);

  return { fetchCartItems };
}

export default useCart;
