import styles from '@/assets/styles/Screen/HomeScreen.styles';
import { CategoryList } from '@/components/categories/categoryList';
import ProductCard from '@/components/products/ProductCard';
import FText from '@/components/Text';
import { productType } from '@/interfaces/product.type';
import { userType } from '@/interfaces/user.type';
import { useProduct } from '@/server/hooks/useProduct';
import { useUser } from '@/server/hooks/useUser';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<userType | null>(null);
  const [products, setProducts] = useState<productType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getInfoUser } = useUser();
  const { getProductsAll } = useProduct();

  const handleFetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        getProductsAll(1, 10).then((res) => setProducts(res.data)),
        getInfoUser(setLoading, setError).then((res) => setUserInfo(res)),
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getInfoUser, getProductsAll]);

  const handleRouterProdDetail = useCallback(() => {
    router.push('/(tabs)/(store)/ProdDetail');
  }, []);

  const handleRouterStore = useCallback(() => {
    router.push('/(tabs)/(store)');
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  const featuredProducts = Array.isArray(products)
    ? products.filter((product: productType) => product.averageRating > 4)
    : [];

  const NewProducts = Array.isArray(products)
    ? products.filter(
        (product: productType) => new Date(product.createdAt) > new Date(new Date().setDate(new Date().getDate() - 7)),
      )
    : [];

  const renderProductItem = ({ item }: { item: productType }) => (
    <ProductCard handleRouterDetail={handleRouterProdDetail} product={item} />
  );

  const keyExtractorProduct = (item: productType, index: number) => item._id?.toString() || index.toString();

  // FIXED: Added loading and error states
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Image
            source={require('@/assets/images/ic_launcher.png')}
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
          <View style={styles.contentContainer}>
            <FText>Lỗi: {error}</FText>
            <TouchableOpacity
              onPress={handleFetchData}
              style={{ marginTop: 10, padding: 10, backgroundColor: '#EA4335', borderRadius: 5 }}
            >
              <FText style={{ color: 'white', textAlign: 'center' }}>Thử lại</FText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
                  uri: userInfo?.avatar?.url || 'https://via.placeholder.com/50x50.png?text=Avatar',
                }}
              />
              <View style={styles.headerInfo}>
                <FText style={styles.TextName}>{userInfo?.fullname || 'Người dùng'}</FText>
                <FText style={styles.SubText}>Let&#39;s go shopping</FText>
              </View>
            </View>
            {/* <IconShoppingCart /> */}
          </View>
          <View style={styles.body}>
            <Image style={styles.bannerImage} source={require('@/assets/images/banner/banner17.png')} />

            <View>
              {/*               <View style={styles.sectionHeader}>
                <FText style={styles.sectionTitle}>Danh mục</FText>
              </View> */}
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
