import styles from '@/assets/styles/profile/DeleteAccountButton.styles';
import FText from '@/components/Text';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface DeleteAccountButtonProps {
  onPress?: () => void;
  text?: string;
}

export default function ActionAccountButton({ onPress, text = 'Xóa tài khoản' }: DeleteAccountButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <FText style={styles.deleteAccount}>{text}</FText>
    </TouchableOpacity>
  );
}
