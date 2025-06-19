import styles from '@/assets/styles/Screen/HomeScreen.styles';
import CategoryCard from '@/components/categories/categoryCard';
import ProductCard from '@/components/products/ProductCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { socket } from '@/config/socket';
import useCart from '@/hooks/cart/useCart.hooks';
import useCategory from '@/hooks/category/useCategory.hooks';
import useProduct from '@/hooks/product/useProduct.hooks';
import useUser from '@/hooks/user/useUser.hooks';
import { categoryType } from '@/interfaces/category.type';
import { productType } from '@/interfaces/product.type';
import { userType } from '@/interfaces/user.type';
import { loginSuccess } from '@/redux/authSlice';
import { getCart } from '@/server/cart.server';
import { getCategoriesAll } from '@/server/category.server';
import { getProductsAll } from '@/server/product.server';
import { getInfoUser } from '@/server/user.server';
import { createAxios } from '@/utils/createInstance';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function HomeScreen() {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [lengthItems, setLengthItems] = useState(0);
  const [userInfo, setUserInfo] = useState<userType | null>(null);
  const [products, setProducts] = useState<productType[]>([]);
  const [categories, setCategories] = useState<categoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(false);

  const { fetchInfoUser } = useUser({ getInfoUser, setUserInfo, setLoading, setError });
  const { fetchProduct } = useProduct({ getProductsAll, setProducts });
  const { fetchCartItems } = useCart({ getCart, setLengthItems, accessToken, axiosJWT });
  const { fetchCategories } = useCategory({ getCategoriesAll, setCategories });

  const handleFetchData = useCallback(() => {
    fetchInfoUser();
    fetchProduct();
    fetchCartItems();
    fetchCategories();
  }, [fetchInfoUser, fetchProduct, fetchCartItems, fetchCategories]);

  const handleRouterStore = useCallback(() => {
    router.push('/store');
  }, []);

  useEffect(() => {
    if (!user || !id) return;

    socket.emit('joinUser', id);

    socket.on('cartUpdated', (data) => {
      console.log(data.message);
      setLengthItems(data.itemCount);
    });

    return () => {
      socket.off('cartUpdated');
      socket.disconnect();
    };
  }, [user, id]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  const featuredProducts = products.filter((product: productType) => product.averageRating > 4);

  const NewProducts = products.filter(
    (product: productType) => new Date(product.createdAt) > new Date(new Date().setDate(new Date().getDate() - 7)),
  );
  const featuredCategories = categories.filter((categories: categoryType) => categories.status === 'active');

  const renderProductItem = ({ item }: { item: productType }) => (
    <ProductCard handleRouterStore={handleRouterStore} product={item} />
  );
  const renderCategoryItem = ({ item }: { item: categoryType }) => (
    <CategoryCard handleRouterStore={handleRouterStore} category={item} />
  );

  const keyExtractorProduct = (item: productType, index: number) => item._id?.toString() || index.toString();
  const keyExtractorCategory = (item: categoryType, index: number) => item._id?.toString() || index.toString();

  // FIXED: Added loading and error states
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 200, height: 200, resizeMode: 'contain' }}
          />
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <ThemedView style={styles.contentContainer} lightColor="white" darkColor="black">
            <ThemedText>Lỗi: {error}</ThemedText>
            <TouchableOpacity
              onPress={handleFetchData}
              style={{ marginTop: 10, padding: 10, backgroundColor: '#EA4335', borderRadius: 5 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Thử lại</Text>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView lightColor="white" darkColor="black">
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: userInfo?.avatar?.url || 'https://via.placeholder.com/50x50.png?text=Avatar',
                }}
              />
              <View style={styles.headerInfo}>
                <ThemedText style={styles.TextName}>{userInfo?.fullname || 'Người dùng'}</ThemedText>
                <Text style={styles.SubText}>Let&#39;s go shopping</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.cartButton}>
                <AntDesign name="shoppingcart" size={30} color="#000" />
                <Text style={styles.cartItemCount}>{lengthItems > 9 ? '9+' : lengthItems}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.body}>
            <Image style={styles.bannerImage} source={require('@/assets/images/banner/banner17.png')} />

            <View>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Danh mục</ThemedText>
                <TouchableOpacity>
                  <ThemedText type="link" style={styles.seeMore}>
                    Xem thêm
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryListContainer}>
                <FlatList
                  data={featuredCategories}
                  renderItem={renderCategoryItem}
                  keyExtractor={keyExtractorCategory}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
            <View>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Sản phẩm nổi bật</ThemedText>
                <TouchableOpacity>
                  <ThemedText type="link" style={styles.seeMore}>
                    Xem thêm
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.productListContainer}>
                <FlatList
                  data={featuredProducts}
                  renderItem={renderProductItem}
                  keyExtractor={keyExtractorProduct}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>

            {NewProducts.length > 0 && (
              <View>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionTitle}>Hàng mới về</ThemedText>
                  <TouchableOpacity>
                    <ThemedText type="link" style={styles.seeMore}>
                      Xem thêm
                    </ThemedText>
                  </TouchableOpacity>
                </View>
                <View style={styles.productListContainer}>
                  <FlatList
                    data={NewProducts}
                    renderItem={renderProductItem}
                    keyExtractor={keyExtractorProduct}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            )}
          </View>
        </ThemedView>
      </ScrollView>
    </>
  );
}
