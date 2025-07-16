import { userType } from '@/interfaces/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  login: {
    currentUser: userType | null;
    isFetching: boolean;
    error: boolean;
  };
}

const initialState: AuthState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
      state.login.error = false;
    },
    loginSuccess: (state, action: PayloadAction<userType>) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
  },
});

export const { loginStart, loginFailed, loginSuccess } = authSlice.actions;

export default authSlice.reducer;
