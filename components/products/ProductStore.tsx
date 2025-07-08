import styles from '@/assets/styles/products/ProductStore.styles';
import FText from '@/components/Text';
import { productType } from '@/interfaces/product.type';
import { useCart } from '@/server/hooks/useCart';
import { memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';

interface ProductStoreProps {
  handleRouterDetail: () => void;
  product: productType;
}

function ProductStore({ product, handleRouterDetail }: ProductStoreProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItemToCart } = useCart();

  const imageSource = useMemo(() => {
    return { uri: product.images[0]?.url };
  }, [product.images]);

  const discountedPrice = useMemo(() => {
    return product.price * (1 - product.discount / 100);
  }, [product.price, product.discount]);

  const formattedDiscountedPrice = useMemo(() => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(discountedPrice);
  }, [discountedPrice]);

  const formattedOriginalPrice = useMemo(() => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(product.price);
  }, [product.price]);

  const handleAddToCart = useCallback(
    async (product: productType) => {
      if (isAddingToCart) return;

      try {
        setIsAddingToCart(true);
        const res = await addItemToCart(product);
        if (res.success) {
          Toast.show({
            type: 'success',
            text1: 'Đã thêm vào giỏ hàng',
            text1Style: { color: 'green', fontSize: 18, fontWeight: '600', backgroundColor: 'red' },
            position: 'top',
            visibilityTime: 500,
          });
        }
      } catch (err) {
        Alert.alert('Thêm vào giỏ hàng thất bại', 'Vui lòng thử lại sau');
        console.error(err);
      } finally {
        setIsAddingToCart(false);
      }
    },
    [addItemToCart, isAddingToCart],
  );

  const safeHandleRouterDetail = useCallback(() => {
    if (isNavigating) return; // Prevent multiple navigation

    setIsNavigating(true);
    handleRouterDetail();

    // Reset sau 1 giây
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [handleRouterDetail, isNavigating]);

  return (
    <TouchableOpacity
      style={styles.product}
      onPress={safeHandleRouterDetail}
      disabled={isNavigating} // Disable khi đang navigate
      activeOpacity={isNavigating ? 1 : 0.7}
    >
      <View style={styles.productImage}>
        <Image
          source={imageSource}
          style={styles.productImage}
          resizeMode="cover"
          loadingIndicatorSource={require('@/assets/images/placeholder.png')}
        />
      </View>
      <View style={styles.productInfo}>
        <FText numberOfLines={1} ellipsizeMode="tail" style={styles.productCategory}>
          {product._idCategory.name}
        </FText>
        <FText numberOfLines={1} ellipsizeMode="tail" style={styles.productTitle}>
          {product.name}
        </FText>
        <StarRatingDisplay
          maxStars={5}
          starSize={20}
          starStyle={{ marginHorizontal: 0, marginBottom: 5 }}
          rating={product.averageRating}
        />
        <View style={styles.productPriceContainer}>
          <FText style={styles.productPrice}>{formattedDiscountedPrice}</FText>
          <FText style={styles.productPriceOld}>{formattedOriginalPrice}</FText>
        </View>
        <TouchableOpacity
          style={[styles.productButton, isAddingToCart && { opacity: 0.5 }]}
          onPress={() => handleAddToCart(product)}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <FText style={styles.productButtonText}>Thêm vào giỏ hàng</FText>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductStore);
