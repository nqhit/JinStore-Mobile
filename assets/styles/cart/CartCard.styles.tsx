import { COLORS } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    maxHeight: 120,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 10,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  info: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 5,
    width: '100%',
  },

  topInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  bottomInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  cartItemPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  cartItemQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: COLORS.gray200,
    borderRadius: 10,
  },

  name: {
    fontSize: 16,
    width: 170,
    textTransform: 'capitalize',
  },

  image: {
    width: 80,
    height: 80,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderColor: COLORS.gray300,
    borderRadius: 10,
  },

  discountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'center',
    width: 15,
    textAlign: 'center',
  },
});

export default styles;
