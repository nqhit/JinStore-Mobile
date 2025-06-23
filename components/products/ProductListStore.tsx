import useProduct from '@/hooks/product/useProduct.hooks';
import { productType } from '@/interfaces/product.type';
import { getProductsAll } from '@/server/product.server';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import Loading from '../loading';
import ProductStore from './ProductStore';

function ProductListStore() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<productType[]>([]);
  const { fetchProduct } = useProduct({ getProductsAll, setProducts });

  const handleFetchData = useCallback(async () => {
    try {
      setLoading(true);
      await fetchProduct();
    } catch (error) {
      console.log('Lỗi fetch', error);
    } finally {
      setLoading(false);
    }
  }, [fetchProduct]);

  useEffect(() => {
    try {
      handleFetchData();
    } catch (error) {
      console.log('Lỗi ở ProductListStore', error);
    }
  }, [handleFetchData]);

  const handleRouterStore = useCallback(() => {
    router.push('/details/ProductDetail');
  }, []);

  const featuredProducts = products.filter((product: productType) => product.isActive);
  const keyExtractorProduct = (item: productType, index: number) => item._id?.toString() || index.toString();
  const renderProductItem = ({ item }: { item: productType }) => (
    <ProductStore handleRouterDetail={handleRouterStore} product={item} />
  );

  return (
    <View style={{ paddingTop: 10, flex: 1 }}>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          numColumns={2}
          data={featuredProducts}
          renderItem={renderProductItem}
          keyExtractor={keyExtractorProduct}
          scrollEnabled={false}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
        />
      )}
    </View>
  );
}

export default memo(ProductListStore);
