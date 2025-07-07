import { loginSuccess } from '@/redux/slices/authSlice';
import { createAxios } from '@/server/axiosInstance';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { userService } from '@/server/services/user.service';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useUser = () => {
  const user = useCurrentUser();
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const getInfoUser = useCallback(
    async (setLoading: (loading: boolean) => void, setError: (error: string | null) => void) => {
      if (!id || !accessToken) {
        console.log('Missing credentials:', { id: !!id, accessToken: !!accessToken });
        setError('Thiếu thông tin đăng nhập');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await userService.getInfoUser(id, accessToken, axiosJWT);

        return res.user;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
        console.log('Error in fetchInfoUser:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  return { getInfoUser };
};
