import { loginFormData, registerFormData } from '@/interfaces/auth.type';
import { AuthService } from '@/server/services/auth.service';
import { useDispatch } from 'react-redux';
import { useCurrentUser } from './useCurrentUser';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const id = user?._id as string;

  const login = async (formData: loginFormData) => {
    return await AuthService.login(formData, dispatch);
  };

  const logout = async () => {
    if (!id) {
      console.log('User not logged in');
    }
    return await AuthService.logOut(id);
  };

  const register = async (formData: registerFormData) => {
    return await AuthService.register(formData, dispatch);
  };

  const sendOtp = async (email: string) => {
    return await AuthService.sendOtp(email);
  };

  const verifyOtp = async (email: string, otp: string) => {
    return await AuthService.verifyOtp(email, otp);
  };

  const resetPassword = async (email: string, password: string, confirmPassword: string) => {
    return await AuthService.resetPassword(email, password, confirmPassword);
  };

  return {
    login,
    logout,
    register,
    sendOtp,
    verifyOtp,
    resetPassword,
  };
};
