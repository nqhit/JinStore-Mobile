export interface categoryType {
  _id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  isOutstanding: boolean;
  status: string;
  image: {
    url: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
}
