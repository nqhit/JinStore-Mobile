export const ENDPOINTS = {
  // NOTE: AUTH
  LOGIN: '/mobile/login',
  LOGOUT: '/mobile/logout',
  REGISTER: '/auth/register',
  REFRESH: '/mobile/refresh',
  SEND_OTP: '/otp/send-otp',
  VERIFY_OTP: '/otp/verify-otp',
  RESET_PASSWORD: '/users/reset-password',
  CHANGE_PASSWORD: '/users/change-password',

  // NOTE: USER
  INFO_USER: (id: string) => `/mobile/users/info-user/${id}`,
  UPDATE_INFO_USER: 'mobile/users/info-user/update',

  // NOTE: Sản phẩm
  PRODUCTS_ALL: (page: number, limit: number) => `/products?page=${page}&size=${limit}`,
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,

  // NOTE: Danh mục
  CATEGORIES_ALL: '/categories',

  //NOTE: Giỏ hàng
  CARTS: '/carts',
  ADD_ITEM_TO_CART: '/carts/add',
  UPDATE_ITEM_IN_CART: '/carts/update',
  REMOVE_ITEM_IN_CART: (id: string) => `/carts/remove/${id}`,

  // NOTE: Mã giảm giá
  ALL_COUPONS_BY_USER: (id: string) => `/discounts/by-user/${id}`,

  // NOTE: ADDRESS
  ADDRESS_USER: '/addresses/user/all',
  ADD_ADDRESS_CUSTOMER: '/addresses/add',
  UPDATE_ADDRESS_CUSTOMER: (id: string) => `/addresses/${id}`,
  DELETE_ADDRESS_CUSTOMER: (id: string) => `/addresses/${id}`,
} as const;
