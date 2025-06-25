import styles from '@/assets/styles/Screen/HomeScreen.styles';
import CategoryCard from '@/components/categories/CategoryCard';
import IconShoppingCart from '@/components/IconShoppingCart';
import ProductCard from '@/components/products/ProductCard';
import FText from '@/components/Text';
import useCategory from '@/hooks/category/useCategory.hooks';
import useProduct from '@/hooks/product/useProduct.hooks';
import useUser from '@/hooks/user/useUser.hooks';
import { categoryType } from '@/interfaces/category.type';
import { productType } from '@/interfaces/product.type';
import { userType } from '@/interfaces/user.type';
import { getCategoriesAll } from '@/server/category.server';
import { getProductsAll } from '@/server/product.server';
import { getInfoUser } from '@/server/user.server';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<userType | null>(null);
  const [products, setProducts] = useState<productType[]>([]);
  const [categories, setCategories] = useState<categoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchInfoUser } = useUser({ getInfoUser, setUserInfo, setLoading, setError });
  const { fetchProduct } = useProduct({ getProductsAll, setProducts });

  const { fetchCategories } = useCategory({ getCategoriesAll, setCategories });

  const handleFetchData = useCallback(() => {
    fetchProduct();
    fetchInfoUser();
    fetchCategories();
  }, [fetchInfoUser, fetchProduct, fetchCategories]);

  const handleRouterStore = useCallback(() => {
    router.push('/details/ProductDetail');
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  const featuredProducts = products.filter((product: productType) => product.averageRating > 4);

  const NewProducts = products.filter(
    (product: productType) => new Date(product.createdAt) > new Date(new Date().setDate(new Date().getDate() - 7)),
  );
  const featuredCategories = categories.filter((categories: categoryType) => categories.status === 'active');

  const renderProductItem = ({ item }: { item: productType }) => (
    <ProductCard handleRouterDetail={handleRouterStore} product={item} />
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
            <IconShoppingCart />
          </View>
          <View style={styles.body}>
            <Image style={styles.bannerImage} source={require('@/assets/images/banner/banner17.png')} />

            <View>
              <View style={styles.sectionHeader}>
                <FText style={styles.sectionTitle}>Danh mục</FText>
                <TouchableOpacity>
                  <FText style={styles.seeMore}>Xem thêm</FText>
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
                <FText style={styles.sectionTitle}>Sản phẩm nổi bật</FText>
                <TouchableOpacity>
                  <FText style={styles.seeMore}>Xem thêm</FText>
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
