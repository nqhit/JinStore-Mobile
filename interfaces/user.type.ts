export interface userType {
  _id: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  fullname: string;
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  dateBirth: string;
  avatar: {
    url: string;
    publicId: string;
  };
  gender: string;
  address: any[];
  authProvider: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  __v: number;
}

export type ProfileFormValues = {
  fullname: string;
  phone: string;
  dateBirth: string;
  gender: string;
};
