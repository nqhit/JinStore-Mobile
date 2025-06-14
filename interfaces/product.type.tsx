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
  images: [
    {
      url: string;
      publicId: string;
    },
  ];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
