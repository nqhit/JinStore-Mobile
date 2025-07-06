// hooks/useCart.ts
import { loginSuccess } from '@/redux/slices/authSlice';
import { createAxios } from '@/server/axiosInstance';
import { CartService } from '@/server/services/cart.service';
import { useDispatch } from 'react-redux';
import { useCurrentUser } from './useCurrentUser';

export const useCart = () => {
  const user = useCurrentUser();
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const getCart = async () => {
    return await CartService.getCart(accessToken, axiosJWT);
  };

  const deleteItemInCart = async (itemId: string) => {
    return await CartService.deleteItemInCart(itemId, accessToken, axiosJWT);
  };

  const updateItemInCart = async (itemId: string, change: number, oldQuantity: number) => {
    const newQuantity = oldQuantity + change;
    if (newQuantity < 1) return;

    const formData = {
      productId: itemId,
      quantity: newQuantity,
    };

    return await CartService.updateItemInCart(formData, accessToken, axiosJWT);
  };
  return { getCart, deleteItemInCart, updateItemInCart };
};
