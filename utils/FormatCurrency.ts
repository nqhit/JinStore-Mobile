export const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0₫';
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
