// hooks/useCurrentUser.ts
import { useSelector } from 'react-redux';

export const useCurrentUser = () => {
  return useSelector((state: any) => state.auth.login.currentUser);
};
