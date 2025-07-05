export interface loginFormData {
  usernameOrEmail: string;
  password: string;
}

export interface registerFormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  id: string;
  isAdmin: boolean;
  exp: number;
  iat?: number;
}
