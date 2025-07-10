import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  footer: {
    marginVertical: 32,
    alignItems: 'flex-start',
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  copyright: {
    fontSize: 14,
    color: COLORS.black_032,
    marginTop: 2,
  },
});

export default styles;
