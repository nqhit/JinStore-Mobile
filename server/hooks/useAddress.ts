import { loginSuccess } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { createAxios } from '../axiosInstance';
import { AddressService } from '../services/address.service';
import { useCurrentUser } from './useCurrentUser';

export const useAddress = () => {
  const user = useCurrentUser();
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const getAllAddress = async () => {
    return await AddressService.getAllAddress(axiosJWT, user?.accessToken);
  };
  return { getAllAddress };
};
