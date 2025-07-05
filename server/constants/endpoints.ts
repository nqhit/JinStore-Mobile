export const ENDPOINTS = {
  LOGIN: '/mobile/login',
  LOGOUT: '/mobile/logout',
  REGISTER: '/auth/register',
  REFRESH: '/mobile/refresh',
  INFO_USER: '/mobile/users/info-user',

  PRODUCTS_ALL: '/products',

  CATEGORIES_ALL: '/categories',

  CARTS: '/carts',
  ADD_ITEM_TO_CART: '/carts/add',
  UPDATE_ITEM_IN_CART: '/carts/update',
  REMOVE_ITEM_IN_CART: '/carts/remove',
} as const;
