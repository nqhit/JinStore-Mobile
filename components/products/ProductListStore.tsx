import useProduct from '@/hooks/product/useProduct.hooks';
import { productResType, productType } from '@/interfaces/product.type';
import { getProductsAll } from '@/server/product.server';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Loading from '../loading';
import ProductStore from './ProductStore';

function ProductListStore() {
  const [products, setProducts] = useState<productResType[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // Tách riêng loading cho load more
  const [refreshing, setRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { fetchProductPagi } = useProduct({ getProductsAll, setProducts });
  const insets = useSafeAreaInsets();

  const handleFetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fetch = await fetchProductPagi(1, limit);
      setHasNextPage(fetch.pagination.hasNextPage);
      setPage(1);
    } catch (error) {
      console.log('Lỗi fetch', error);
    } finally {
      setLoading(false);
    }
  }, [fetchProductPagi, limit]);

  const loadMore = async () => {
    if (loadingMore || !hasNextPage) return; // Dùng loadingMore thay vì loading
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const fetched = await fetchProductPagi(nextPage, limit);
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

  const handleRouterStore = useCallback(() => {
    router.push('/ProdDetail');
  }, []);

  const featuredProducts = useMemo(() => products.filter((product: productType) => product.isActive), [products]);
  const keyExtractorProduct = (item: productType, index: number) => {
    // Đảm bảo key luôn unique bằng cách kết hợp _id và index
    const id = item._id?.toString() || `temp-${index}`;
    return `${id}-${index}`;
  };
  const renderProductItem = ({ item }: { item: productType }) => (
    <ProductStore handleRouterDetail={handleRouterStore} product={item} />
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
          ListFooterComponent={loadingMore && hasNextPage ? <Loading /> : null} // Dùng loadingMore
          columnWrapperStyle={{
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
          showsVerticalScrollIndicator={false} // Ẩn scroll bar cho UI sạch hơn
        />
      )}
    </View>
  );
}

export default memo(ProductListStore);
