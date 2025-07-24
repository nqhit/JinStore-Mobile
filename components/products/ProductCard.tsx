import styles from '@/assets/styles/products/ProductStore.styles';
import FText from '@/components/Text';
import { productType } from '@/interfaces/product.type';
import { useCart } from '@/server/hooks/useCart';
import { formatCurrency } from '@/utils/FormatCurrency';
import { memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';

interface ProductCardProps {
  handleRouterDetail: () => void;
  product: productType;
}

function ProductCard({ product, handleRouterDetail }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItemToCart } = useCart();

  const imageSource = useMemo(() => {
    return { uri: product.images[0]?.url };
  }, [product.images]);

  const discountedPrice = useMemo(() => {
    const price = product?.price as number;
    const discount = product?.discount as number;
    return price * (1 - discount / 100);
  }, [product?.price, product?.discount]);

  const formattedDiscountedPrice = useMemo(() => {
    return formatCurrency(discountedPrice);
  }, [discountedPrice]);

  const formattedOriginalPrice = useMemo(() => {
    return formatCurrency(product.price);
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

  return (
    <TouchableOpacity style={styles.product} onPress={handleRouterDetail}>
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
        {product.averageRating > 0 ? (
          <StarRatingDisplay
            maxStars={5}
            starSize={20}
            starStyle={{ marginHorizontal: 0, marginBottom: 5, height: 20 }}
            rating={product.averageRating}
          />
        ) : (
          <FText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              marginBottom: 5,
              fontSize: 12,
              height: 20,
              textAlign: 'left',
              alignContent: 'center',
              color: 'red',
            }}
          >
            Chưa có đánh giá!
          </FText>
        )}
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

export default memo(ProductCard);
