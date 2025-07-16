// hooks/useCurrentUser.ts
import { userType } from '@/interfaces/user.type';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

export const useCurrentUser = (): userType | null => {
  return useSelector((state) => (state as RootState)?.auth?.login?.currentUser ?? null);
};
