import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    margin: 10,
    width: 100,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.gray300,
  },
});

export default styles;
