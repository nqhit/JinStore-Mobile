import { ProfileFormValues } from '@/interfaces/user.type';
import { loginSuccess } from '@/redux/slices/authSlice';
import { createAxios } from '@/server/axiosInstance';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { userService } from '@/server/services/user.service';
import moment from 'moment';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useUser = () => {
  const user = useCurrentUser();
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const getInfoUser = useCallback(async () => {
    try {
      const res = await userService.getInfoUser(id, accessToken, axiosJWT);

      return res.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      console.log('Error in fetchInfoUser:', errorMessage);
    }
  }, []);

  const updateInfoUser = useCallback(async (formData: ProfileFormValues) => {
    const formattedValues = {
      ...formData,
      dateBirth: moment(formData.dateBirth, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    };

    return await userService.updateInfoUser(formattedValues, accessToken, axiosJWT, dispatch);
  }, []);

  return { getInfoUser, updateInfoUser };
};
