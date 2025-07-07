export const ENDPOINTS = {
  // NOTE: AUTH
  LOGIN: '/mobile/login',
  LOGOUT: '/mobile/logout',
  REGISTER: '/auth/register',
  REFRESH: '/mobile/refresh',
  INFO_USER: '/mobile/users/info-user',

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
} as const;
