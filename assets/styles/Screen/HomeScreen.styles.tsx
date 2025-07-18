import { COLORS } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // COMMENT: HEADER
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
  },

  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  TextName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  SubText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },

  //COMMENT: BODY
  body: {
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    gap: 20,
  },

  // Banner với hình ảnh
  bannerImage: {
    width: screenWidth - 30,
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
    backgroundColor: COLORS.primary,
  },

  //Danh sách danh mục
  cateList: {},

  // Section in body
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 20,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.black,
    justifyContent: 'flex-start',
  },
  seeMore: {
    color: COLORS.primary,
    marginRight: 10,
    fontSize: 16,
  },
  productListContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -10,
    marginVertical: 10,
  },
});

export default styles;
