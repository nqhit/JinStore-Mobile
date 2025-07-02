import { COLORS } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  body: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 10,
    paddingHorizontal: 15,
    gap: 10,
    width: screenWidth,
  },

  containerCheckBoxAll: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },

  btnCheckBoxAll: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    color: 'red',
    gap: 10,
  },

  selectAll: {
    fontSize: 16,
    fontWeight: 'normal',
    flexDirection: 'row',
    alignItems: 'center',
  },

  footer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidth - 30,
  },

  notiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth - 30,
  },

  notification: {
    fontSize: 16,
    fontWeight: '400',
    justifyContent: 'center',
    textAlign: 'center',
    color: COLORS.error,
  },

  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    lineHeight: 32,
  },

  btnCheckout: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },

  textCheckout: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  btnDisabled: {
    backgroundColor: COLORS.gray300,
  },
});

export default styles;
