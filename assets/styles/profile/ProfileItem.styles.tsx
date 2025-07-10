import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  itemValueContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  itemText: {
    fontSize: 16,
  },
  itemValue: {
    fontSize: 16,
    color: COLORS.black_032,
  },
});

export default styles;
