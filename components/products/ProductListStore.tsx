import { productResType, productType } from '@/interfaces/product.type';
import { useProduct } from '@/server/hooks/useProduct';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Loading from '../loading';
import ProductCard from './ProductCard';

function ProductListStore() {
  const [products, setProducts] = useState<productResType[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { getProductsAll } = useProduct();
  const insets = useSafeAreaInsets();

  const handleFetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fetch = await getProductsAll(1, limit);
      setProducts(fetch.data);
      setHasNextPage(fetch.pagination.hasNextPage);
      setPage(1);
    } catch (error) {
      console.log('Lỗi fetch', error);
    } finally {
      setLoading(false);
    }
  }, [getProductsAll, limit]);

  const loadMore = async () => {
    if (loadingMore || !hasNextPage) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const fetched = await getProductsAll(nextPage, limit);
      setProducts((prevProducts) => [...prevProducts, ...fetched.data]);
      setHasNextPage(fetched.pagination.hasNextPage);
      setPage(nextPage);
    } catch (error) {
      console.log('Lỗi load more', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await handleFetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    try {
      handleFetchData();
    } catch (error) {
      console.log('Lỗi ở ProductListStore', error);
    }
  }, [handleFetchData]);

  // Memoize router handler với useCallback
  const handleRouterStore = useCallback((productId: string) => {
    router.push({
      pathname: '/ProdDetail',
      params: { id: productId },
    });
  }, []);

  // Memoize featured products
  const featuredProducts = useMemo(() => products.filter((product: productType) => product.isActive), [products]);

  // Tối ưu hóa keyExtractor
  const keyExtractorProduct = useCallback((item: productType, index: number) => {
    return item._id?.toString() || `temp-${index}`;
  }, []);

  const renderProductItem = useCallback(
    ({ item }: { item: productType }) => (
      <ProductCard handleRouterDetail={() => handleRouterStore(item._id)} product={item} />
    ),
    [handleRouterStore],
  );

  return (
    <View style={{ marginTop: 10, flex: 1 }}>
      {loading && products.length === 0 ? (
        <View style={{ marginTop: 10, flex: 1 }}>
          <Loading />
        </View>
      ) : (
        <FlatList
          numColumns={2}
          data={featuredProducts}
          renderItem={renderProductItem}
          keyExtractor={keyExtractorProduct}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            backgroundColor: 'white',
          }}
          ListFooterComponent={loadingMore && hasNextPage ? <Loading /> : null}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          getItemLayout={undefined}
        />
      )}
    </View>
  );
}

export default memo(ProductListStore);
