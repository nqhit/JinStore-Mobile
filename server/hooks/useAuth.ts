import { loginFormData, registerFormData } from '@/interfaces/auth.type';
import { logoutSuccess } from '@/redux/slices/authSlice';
import { AuthService } from '@/server/services/auth.service';
import { useDispatch } from 'react-redux';
import { createAxios } from '../axiosInstance';
import { useCurrentUser } from './useCurrentUser';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const accessToken = user?.accessToken;
  const id = user?._id;

  const login = async (formData: loginFormData) => {
    return await AuthService.login(formData, dispatch);
  };

  const logout = async () => {
    const axiosJWT = createAxios(user, dispatch, logoutSuccess);
    return await AuthService.logOut(dispatch, id, accessToken, axiosJWT);
  };

  const register = async (formData: registerFormData) => {
    return await AuthService.register(formData, dispatch);
  };

  return {
    login,
    logout,
    register,
  };
};
