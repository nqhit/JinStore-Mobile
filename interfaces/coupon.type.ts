export interface CouponType {
  _id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value?: number; // Chỉ dùng cho loại 'fixed'
  maxPercent?: number; // Chỉ dùng cho loại 'percentage'
  activation: Date;
  expiration: Date;
  isActive: boolean;
  minOrderAmount: number;
  quantityLimit: number;
  quantityUsed: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
