import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    maxHeight: 120,
    width: screenWidth - 30,
    paddingHorizontal: 10,
  },

  content: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: 'row',
    gap: 10,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  info: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 5,
  },

  topInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: screenWidth / 2 + 10,
  },

  cartItemPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  cartItemQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },

  name: {
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 215,
    textTransform: 'uppercase',
  },

  image: {
    width: 80,
    height: 80,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderColor: '#ccc',
    borderRadius: 10,
  },

  discountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 32,
  },

  quantity: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
});

export default styles;
