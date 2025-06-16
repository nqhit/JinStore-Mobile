import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  product: {
    width: (screenWidth + 30) / 2,
    minHeight: screenWidth - 60,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 10,
  },
  productCategory: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 5,
    marginBottom: 5,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
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
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    alignItems: 'center',
  },
  productButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
