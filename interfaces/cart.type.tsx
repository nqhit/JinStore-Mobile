export interface CartItem {
  _idProduct: string;
  quantity: number;
}

export interface Cart {
  _idUser: string;
  items: CartItem[];
  updatedAt: string;
  createdAt?: string;
  _id?: string;
}
