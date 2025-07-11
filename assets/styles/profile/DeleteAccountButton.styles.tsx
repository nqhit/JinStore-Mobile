import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  deleteAccountButton: {
    marginTop: 24,
    alignSelf: 'flex-start',
  },
  deleteAccount: {
    color: COLORS.error,
    textAlign: 'left',
    fontSize: 16,
  },
});

export default styles;
