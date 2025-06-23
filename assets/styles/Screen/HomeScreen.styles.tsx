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
    backgroundColor: '#fff',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // COMMENT: HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 12,
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
    borderColor: '#8B5CF6',
  },
  TextName: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  SubText: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '500',
  },

  //COMMENT: BODY
  body: {
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingTop: 20,
  },

  // Banner với hình ảnh
  bannerImage: {
    width: screenWidth - 30,
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
    backgroundColor: '#8B5CF6',
  },

  //Danh sách danh mục
  cateList: {},

  // Section in body
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#000',
    justifyContent: 'flex-start',
  },
  seeMore: {
    color: '#8B5CF6',
    marginRight: 10,
  },
  productListContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -10,
  },
  categoryListContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default styles;
