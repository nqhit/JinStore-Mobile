import axios from 'axios';
import { Alert } from 'react-native';

export const ErrorHandler = {
  handleAuthError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra';
      Alert.alert('Lỗi', message);
      return message;
    }

    const defaultMessage = 'Có lỗi không xác định xảy ra';
    Alert.alert('Lỗi', defaultMessage);
    return defaultMessage;
  },
  showSuccess(message: string): void {
    Alert.alert('Thành công', message);
  },
  showError(message: string): void {
    Alert.alert('Lỗi', message);
  },
};
