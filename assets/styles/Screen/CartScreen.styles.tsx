import { COLORS } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 10,
    paddingHorizontal: 15,
    gap: 10,
    width: screenWidth,
  },

  containerCheckBoxAll: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },

  btnCheckBoxAll: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    color: 'red',
    gap: 5,
  },

  selectAll: {
    fontSize: 14,
    fontWeight: 'normal',
    flexDirection: 'row',
    alignItems: 'center',
  },

  footer: {
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
  },

  footerTop: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: COLORS.gray200,
  },

  footerBottom: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: COLORS.gray200,
  },

  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 15,
  },

  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },

  discountText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    lineHeight: 20,
  },

  couponLeft: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  totalContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  total: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    lineHeight: 20,
  },

  amountSaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  amountSave: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    lineHeight: 20,
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

  saveText: {
    fontSize: 16,
    color: COLORS.primary,
    lineHeight: 23,
  },
  btnCheckout: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  textCheckout: {
    fontSize: 16,
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
