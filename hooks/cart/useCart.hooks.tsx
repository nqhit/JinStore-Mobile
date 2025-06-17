import { useCallback } from 'react';

function useCart({ getCart, setLengthItems, accessToken, axiosJWT }: any) {
  const fetchCartItems = useCallback(async () => {
    try {
      const res = await getCart(accessToken, axiosJWT);
      const count = res?.itemCount || 0;
      setLengthItems(count);
    } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
      setLengthItems(0);
    }
  }, []);
  return { fetchCartItems };
}

export default useCart;
