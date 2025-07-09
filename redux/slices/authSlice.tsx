import { userType } from '@/interfaces/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  login: {
    currentUser: userType | null;
    isFetching: boolean;
    error: boolean;
  };
  register: {
    isFetching: boolean;
    error: boolean;
    success: boolean;
  };
  resetPassword: {
    isFetching: boolean;
    error: boolean;
    success: boolean;
  };
  otp: {
    isFetching: boolean;
    error: boolean;
    success: boolean;
  };
}

const initialState: AuthState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  register: {
    isFetching: false,
    error: false,
    success: false,
  },
  resetPassword: {
    isFetching: false,
    error: false,
    success: false,
  },
  otp: {
    isFetching: false,
    error: false,
    success: false,
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

    logoutStart: (state) => {
      state.login.isFetching = true;
    },
    logoutSuccess: (state) => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.error = false;
    },
    logoutFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },

    registerStart: (state) => {
      state.register.isFetching = true;
      state.register.error = false;
      state.register.success = false;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },

    resetPasswordStart: (state) => {
      state.resetPassword.isFetching = true;
      state.resetPassword.error = false;
      state.resetPassword.success = false;
    },
    resetPasswordSuccess: (state) => {
      state.resetPassword.isFetching = false;
      state.resetPassword.error = false;
      state.resetPassword.success = true;
    },
    resetPasswordFailed: (state) => {
      state.resetPassword.isFetching = false;
      state.resetPassword.error = true;
      state.resetPassword.success = false;
    },

    otpStart: (state) => {
      state.otp.isFetching = true;
      state.otp.error = false;
      state.otp.success = false;
    },
    otpSuccess: (state) => {
      state.otp.isFetching = false;
      state.otp.error = false;
      state.otp.success = true;
    },
    otpFailed: (state) => {
      state.otp.isFetching = false;
      state.otp.error = true;
      state.otp.success = false;
    },

    resetAuthState: (state) => {
      state.register = initialState.register;
      state.resetPassword = initialState.resetPassword;
      state.otp = initialState.otp;
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailed,
  otpStart,
  otpSuccess,
  otpFailed,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
