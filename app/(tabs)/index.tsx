import styles from '@/assets/styles/Screen/HomeScreen.styles';
import ProductCard from '@/components/products/ProductCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useProduct from '@/hooks/product/useProduct.hooks';
import useUser from '@/hooks/user/useUser.hooks';
import { userType } from '@/interfaces/user.type';
import { getProductsAll } from '@/server/product.server';
import { getInfoUser } from '@/server/user.server';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<userType | null>(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchInfoUser } = useUser({ getInfoUser, setUserInfo, setLoading, setError });
  const { fetchProduct } = useProduct({ getProductsAll, setProducts });
  useEffect(() => {
    fetchInfoUser();
    fetchProduct();
  }, [fetchInfoUser]);

  // FIXED: Added loading and error states
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <ThemedView style={styles.contentContainer} lightColor="white" darkColor="black">
            <ThemedText>Đang tải...</ThemedText>
          </ThemedView>
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
              onPress={fetchInfoUser}
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
              <TouchableOpacity>
                <AntDesign name="search1" size={30} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign name="shoppingcart" size={30} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.body}>
            <Image style={styles.bannerImage} source={require('@/assets/images/banner/banner17.png')} />

            <View style={styles.productList}>
              <View style={styles.Outstanding}>
                <ThemedText style={styles.OutstandingTitle}>Sản phẩm nổi bật</ThemedText>
                <TouchableOpacity>
                  <ThemedText type="link" style={styles.seeMore}>
                    Xem thêm
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.productListContainer}>
                <FlatList data={products} renderItem={({ item }) => <ProductCard product={item} />} horizontal />
              </View>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </>
  );
}
