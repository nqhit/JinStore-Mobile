export const formatDateInput = (value: string) => {
  // Xóa ký tự không phải số
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 2 && cleaned.length <= 4) {
    cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  } else if (cleaned.length > 4) {
    cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
  }
  return cleaned;
};
