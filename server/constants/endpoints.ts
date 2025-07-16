export const ENDPOINTS = {
  // NOTE: AUTH
  LOGIN: '/mobile/login',
  LOGOUT: '/mobile/logout',
  REGISTER: '/auth/register',
  REFRESH: '/mobile/refresh',
  SEND_OTP: '/otp/send-otp',
  VERIFY_OTP: '/otp/verify-otp',
  RESET_PASSWORD: '/users/reset-password',

  // NOTE: USER
  INFO_USER: (id: string) => `/mobile/users/info-user/${id}`,
  UPDATE_INFO_USER: 'mobile/users/info-user/update',

  // NOTE: Sản phẩm
  PRODUCTS_ALL: '/products',

  // NOTE: Danh mục
  CATEGORIES_ALL: '/categories',

  //NOTE: Giỏ hàng
  CARTS: '/carts',
  ADD_ITEM_TO_CART: '/carts/add',
  UPDATE_ITEM_IN_CART: '/carts/update',
  REMOVE_ITEM_IN_CART: '/carts/remove',

  // NOTE: Mã giảm giá
  ALL_COUPONS_BY_USER: (id: string) => `/discounts/by-user/${id}`,

  // NOTE: ADDRESS
  ADDRESS_USER: '/addresses/user/all',
  ADD_ADDRESS_CUSTOMER: '/addresses/add',
  DELETE_ADDRESS_CUSTOMER: (id: string) => `/addresses/${id}`,
} as const;
