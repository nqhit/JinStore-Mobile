export interface userType {
  _id: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  fullname: string;
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  avatar: {
    url: string;
    publicId: string;
  };
  address: any[];
  authProvider: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
