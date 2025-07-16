import { loginSuccess } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { createAxios } from '../axiosInstance';
import { couponService } from '../services/coupon.service';
import { useCurrentUser } from './useCurrentUser';

export const useCoupon = () => {
  const user = useCurrentUser();
  const dispatch = useDispatch();
  if (!user) return;
  const accessToken = user?.accessToken;
  const id = user?._id;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const getAllDiscountUser = async () => {
    return await couponService.getAllDiscountUser(id, axiosJWT, accessToken);
  };

  return {
    getAllDiscountUser,
  };
};
