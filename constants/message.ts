import { formatCurrency } from '@/utils/FormatCurrency';

export const COUPON_MESSAGES = {
  NO_ITEMS_SELECTED: 'Vui lòng chọn sản phẩm để áp dụng mã giảm giá',
  NO_COUPON: 'Chưa có mã giảm giá',
  INVALID_COUPON: 'Mã giảm giá không hợp lệ',
  INSUFFICIENT_AMOUNT: (amount: number) => `Đơn hàng tối thiểu ${formatCurrency(amount)} để áp dụng mã này`,
  VALID: 'Mã giảm giá hợp lệ',
};
