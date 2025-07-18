import styles from '@/assets/styles/Screen/HomeScreen.styles';
import { CategoryList } from '@/components/categories/CategoryList';
import IconOnlOff from '@/components/IconOnlOff';
import ProductCard from '@/components/products/ProductCard';
import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import { useSingledPush } from '@/hooks/useSignlePush';
import { productType } from '@/interfaces/product.type';
import { userType } from '@/interfaces/user.type';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { useProduct } from '@/server/hooks/useProduct';
import { useUser } from '@/server/hooks/useUser';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const user = useCurrentUser();
  const singlePush = useSingledPush();
  const [userInfo, setUserInfo] = useState<userType | null>(user ?? null);
  const [products, setProducts] = useState<productType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const tabBarHeight = useBottomTabBarHeight();

  const { getInfoUser } = useUser();
  const { getProductsAll } = useProduct();
  const fetchUser = async () => {
    try {
      const res = await getInfoUser();
      setUserInfo(res);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi lấy thông tin người dùng';
      setError(errorMessage);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getProductsAll(1, 10);
      setProducts(res.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi lấy sản phẩm';
      setError(errorMessage);
    }
  };

  const handleFetchData = async () => {
    setError(null);
    await Promise.all([fetchProducts(), !userInfo && fetchUser()]);
  };

  const handleRouterProdDetail = useCallback(
    (productId: string) => {
      singlePush('/(tabs)/(store)/ProdDetail', { id: productId });
    },
    [singlePush],
  );

  const handleRouterStore = useCallback(
    (id: string) => {
      singlePush('/(tabs)/(store)', { id });
    },
    [singlePush],
  );

  useEffect(() => {
    handleFetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  const featuredProducts = Array.isArray(products)
    ? products.filter((product: productType) => product.averageRating > 4)
    : [];

  const NewProducts = Array.isArray(products)
    ? products.filter(
        (product: productType) => new Date(product.createdAt) > new Date(new Date().setDate(new Date().getDate() - 7)),
      )
    : [];

  const renderProductItem = ({ item }: { item: productType }) => (
    <ProductCard handleRouterDetail={() => handleRouterProdDetail(item._id)} product={item} />
  );

  const keyExtractorProduct = (item: productType, index: number) => item._id?.toString() || index.toString();

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <FText>Lỗi: {error}</FText>
            <TouchableOpacity
              onPress={handleFetchData}
              style={{ marginTop: 10, padding: 10, backgroundColor: COLORS.error, borderRadius: 5 }}
            >
              <FText style={{ color: 'white', textAlign: 'center' }}>Thử lại</FText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: userInfo?.avatar?.url || '@/assets/images/placeholder.png',
                }}
              />
              <View style={styles.headerInfo}>
                <FText style={styles.TextName}>{userInfo?.fullname || 'Người dùng'}</FText>
                <FText style={styles.SubText}>Let&#39;s go shopping</FText>
              </View>
            </View>
            <IconOnlOff />
          </View>
          <View style={styles.body}>
            <Image style={styles.bannerImage} source={require('@/assets/images/banner/banner17.png')} />

            <View>
              <CategoryList handleSubmit={handleRouterStore} />
            </View>
            <View>
              <View style={styles.sectionHeader}>
                <FText style={styles.sectionTitle}>Sản phẩm nổi bật</FText>
              </View>
              <View style={styles.productListContainer}>
                <FlatList
                  data={featuredProducts}
                  renderItem={renderProductItem}
                  keyExtractor={keyExtractorProduct}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                  contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: tabBarHeight }}
                />
              </View>
            </View>

            {NewProducts.length > 0 && (
              <View>
                <View style={styles.sectionHeader}>
                  <FText style={styles.sectionTitle}>Hàng mới về</FText>
                  <TouchableOpacity>
                    <FText style={styles.seeMore}>Xem thêm</FText>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
