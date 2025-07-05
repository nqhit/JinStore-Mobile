export interface CartItemType {
  _id: string;
  name: string;
  unit: string;
  price: number;
  discount: number;
  discountPrice: number;
  totalDiscountPrice: number;
  quantity: number;
  images: [
    {
      url: string;
      publicId: string;
    },
  ];
}

export interface CartType {
  _idUser: string;
  items: CartItemType[];
  updatedAt: string;
  createdAt?: string;
  _id?: string;
}
