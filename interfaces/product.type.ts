export interface productType {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  unit: string;
  _idCategory: {
    _id: string;
    name: string;
  };
  images: imageUrlType[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  __v: number;
}

export interface productResType extends productType {
  pagination: {
    page: number;
    limit: number;
    totalProducts: number;
    totalPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface productToCartType {
  productId: string;
  quantity: number;
}

export interface imageUrlType {
  url: string;
  publicId: string;
}
