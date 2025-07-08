import { create } from 'zustand';

type CouponStore = {
  couponItem: {
    _id: string;
    code: string;
    type: string;
    discount?: number;
    minOrderAmount: number;
  } | null;
  setCouponItem: (item: CouponStore['couponItem']) => void;
  clearCouponCode: () => void;
};

export const useCouponStore = create<CouponStore>((set) => ({
  couponItem: null,
  setCouponItem: (item) => set({ couponItem: item }),
  clearCouponCode: () =>
    set({
      couponItem: null,
    }),
}));
