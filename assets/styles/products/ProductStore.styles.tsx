import { COLORS } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  product: {
    width: screenWidth / 2 - 20,
    minHeight: 200,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderColor: COLORS.gray300,
    borderWidth: 1,
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 10,
  },
  productCategory: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 5,
    marginBottom: 5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productPrice: {
    fontSize: 16,
  },
  productPriceOld: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  productButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  productButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
