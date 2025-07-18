import { ChangePasswordFormValues, ProfileFormValues } from '@/interfaces/user.type';
import { loginSuccess } from '@/redux/slices/authSlice';
import { createAxios } from '@/server/axiosInstance';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { userService } from '@/server/services/user.service';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { handleLogoutWithToast } from '../auth.helper';

export const useUser = () => {
  const dispatch = useDispatch();
  const user = useCurrentUser();

  const axiosJWT = useMemo(() => {
    if (!user) return null;
    return createAxios(user, dispatch, loginSuccess);
  }, [user, dispatch]) as any;

  const id = user?._id || '';
  const accessToken = user?.accessToken || '';

  const getInfoUser = useCallback(async () => {
    try {
      if (!user?._id || !user.accessToken || !axiosJWT) return handleLogoutWithToast();
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

  const changePassword = useCallback(async (formData: ChangePasswordFormValues) => {
    return await userService.changePassword(formData, accessToken, axiosJWT);
  }, []);

  return { getInfoUser, updateInfoUser, changePassword };
};
