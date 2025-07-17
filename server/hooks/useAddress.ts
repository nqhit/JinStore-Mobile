import { AddressFormValues } from '@/interfaces/address.type';
import { userType } from '@/interfaces/user.type';
import { loginSuccess } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { createAxios } from '../axiosInstance';
import { AddressService } from '../services/address.service';
import { useCurrentUser } from './useCurrentUser';

export const useAddress = () => {
  const dispatch = useDispatch();
  const user = useCurrentUser() as userType;
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const getCustomerAddress = async () => {
    return await AddressService.getCustomerAddress(axiosJWT, accessToken);
  };

  const actionsAddressCustomer = async (address: AddressFormValues, id?: string) => {
    console.log('id: ', id);
    if (id) {
      return await AddressService.actionsAddress(address, accessToken, axiosJWT, id);
    } else {
      return await AddressService.actionsAddress(address, accessToken, axiosJWT);
    }
  };

  const deleteAddress = async (id: string) => {
    return await AddressService.deleteAddress(id, accessToken, axiosJWT);
  };
  return { getCustomerAddress, actionsAddressCustomer, deleteAddress };
};
