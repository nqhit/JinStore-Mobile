import { loginSuccess } from '@/redux/authSlice';
import { createAxios } from '@/utils/createInstance';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function useUser({ getInfoUser, setUserInfo, setLoading, setError }: any) {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const fetchInfoUser = useCallback(async () => {
    if (!id || !accessToken) {
      console.log('Missing credentials:', { id: !!id, accessToken: !!accessToken });
      setError('Thiếu thông tin đăng nhập');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await getInfoUser(id, accessToken, axiosJWT);

      setUserInfo(res);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      console.log('Error in fetchInfoUser:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  return { fetchInfoUser };
}

export default useUser;
