import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',

    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    elevation: 5,
  },

  info: {
    gap: 5,
    width: '80%',
  },

  default: {
    color: COLORS.greenDefault,
    fontWeight: 'bold',
    paddingVertical: 5,
    backgroundColor: COLORS.green100,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },

  undefault: {
    paddingVertical: 5,
    backgroundColor: COLORS.gray200,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
    gap: 10,
  },
});
