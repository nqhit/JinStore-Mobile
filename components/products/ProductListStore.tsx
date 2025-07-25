import { INITIAL_PAGE, LIMIT, MAX_TO_RENDER_PER_BATCH, WINDOW_SIZE } from '@/constants/number';
import { useSingledPush } from '@/hooks/useSignlePush';
import { productResType, productType } from '@/interfaces/product.type';
import { useProduct } from '@/server/hooks/useProduct';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Loading from '../loading';
import ProductCard from './ProductCard';

function ProductListStore({ _idCate }: { _idCate?: string }) {
  const [products, setProducts] = useState<productResType[]>([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const isLoadingMoreRef = useRef(false);
  const flatListRef = useRef<FlatList>(null);

  const { getProductsAll } = useProduct();
  const singlePush = useSingledPush();
  const tabBarHeight = useBottomTabBarHeight();

  const resetStates = useCallback(() => {
    setProducts([]);
    setPage(INITIAL_PAGE);
    setHasNextPage(true);
    isLoadingMoreRef.current = false;
  }, []);

  const handleFetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fetch = await getProductsAll(1, LIMIT);
      setProducts(fetch.data);
      setHasNextPage(fetch.pagination.hasNextPage);
      setPage(1);
    } catch (error) {
      console.log('Lỗi fetch', error);
    } finally {
      setLoading(false);
    }
  }, [getProductsAll]);

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasNextPage || loadingMore) {
      return;
    }
    try {
      isLoadingMoreRef.current = true;
      setLoadingMore(true);

      const nextPage = page + 1;
      const fetched = await getProductsAll(nextPage, LIMIT);

      setProducts((prevProducts) => [...prevProducts, ...fetched.data]);
      setHasNextPage(fetched.pagination.hasNextPage);
      setPage(nextPage);
    } catch (error) {
      console.log('Lỗi load more', error);
    } finally {
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  }, [page, hasNextPage, loadingMore, getProductsAll]);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    resetStates();
    await handleFetchData();
    setRefreshing(false);
  }, [refreshing, resetStates, handleFetchData]);

  const handleRouterProdDetail = useCallback(
    (productId: string) => {
      if (!productId) return;

      singlePush('/ProdDetail/[id]', { id: productId });
    },
    [singlePush],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product: productType) => {
      const isActive = product.isActive;
      const matchesCategory = _idCate ? product._idCategory?._id === _idCate : true;

      return isActive && matchesCategory;
    });
  }, [products, _idCate]);

  const keyExtractorProduct = useCallback((item: productType, index: number) => {
    return item._id?.toString() || `temp-${index}`;
  }, []);

  const renderProductItem = useCallback(
    ({ item }: { item: productType }) => (
      <ProductCard handleRouterDetail={() => handleRouterProdDetail(item._id)} product={item} />
    ),
    [handleRouterProdDetail],
  );

  const getItemLayout = useCallback((data: any, index: number) => {
    const ITEM_HEIGHT = 280;
    const ITEM_MARGIN = 10;

    return {
      length: ITEM_HEIGHT + ITEM_MARGIN,
      offset: (ITEM_HEIGHT + ITEM_MARGIN) * index,
      index,
    };
  }, []);

  const ListFooterComponent = useMemo(() => {
    if (loadingMore && hasNextPage) {
      return (
        <View style={styles.footerLoader}>
          <Loading />
        </View>
      );
    }
    return null;
  }, [loadingMore, hasNextPage]);

  const ListEmptyComponent = useMemo(() => {
    if (loading) return null;

    return <View style={styles.emptyContainer}>{/* Add your empty state component here */}</View>;
  }, [loading]);

  useEffect(() => {
    handleFetchData();
  }, [_idCate]);

  useEffect(() => {
    if (_idCate) {
      resetStates();
    }
  }, [_idCate, resetStates]);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" colors={['#007AFF']} />,
    [refreshing, onRefresh],
  );

  return (
    <View style={styles.container}>
      {loading && products.length === 0 ? (
        <View style={styles.initialLoader}>
          <Loading />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          numColumns={2}
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={keyExtractorProduct}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={refreshControl}
          contentContainerStyle={{
            paddingBottom: tabBarHeight,
            backgroundColor: 'white',
            paddingTop: 10,
          }}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
          updateCellsBatchingPeriod={50}
          initialNumToRender={8}
          windowSize={WINDOW_SIZE}
          getItemLayout={getItemLayout}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 100,
          }}
          disableIntervalMomentum={true}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
}

export default memo(ProductListStore);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  initialLoader: {
    paddingTop: 20,
    flex: 1,
  },

  row: {
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
});
