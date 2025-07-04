export const endpoints = {
  login: '/mobile/login',
  logout: '/mobile/logout',
  register: '/auth/register',
  refresh: '/mobile/refresh',
  infoUser: '/mobile/users/info-user',

  productsAll: '/products',

  categoriesAll: '/categories',

  carts: '/carts',
  addItemToCart: '/carts/add',
  updateItemInCart: '/carts/update',
  deleteItemInCart: '/carts/remove',
} as const;
