import styles from '@/assets/styles/products/ProductCard.styles';
import FText from '@/components/Text';
import { productType } from '@/interfaces/product.type';
import { useCart } from '@/server/hooks/useCart';
import { memo } from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';

function ProductCard({
  product,
  handleRouterDetail = () => {},
}: {
  handleRouterDetail: () => void;
  product: productType;
}) {
  const { addItemToCart } = useCart();
  const handleAddToCart = async (product: productType) => {
    if (!product || !product._id) return;

    const formData = {
      productId: product._id,
      quantity: 1,
    };

    try {
      const res = await addItemToCart(formData);
      if (res.success) {
        Toast.show({
          type: 'success',
          text1: 'Đã thêm vào giỏ hàng',
          text1Style: { color: 'green', fontSize: 16, fontWeight: '600', backgroundColor: 'red' },
          position: 'bottom',
          visibilityTime: 800,
        });
      }
    } catch (err) {
      Alert.alert('Thêm vào giỏ hàng thất bại', 'Vui lòng thử lại sau');
      console.error(err);
    }
  };

  return (
    <TouchableOpacity style={styles.product} onPress={handleRouterDetail}>
      <View style={styles.productImage}>
        <Image source={{ uri: product.images[0]?.url }} style={styles.productImage} />
      </View>
      <View style={styles.productInfo}>
        <FText numberOfLines={1} ellipsizeMode="tail" style={styles.productCategory}>
          {product._idCategory.name}
        </FText>
        <FText numberOfLines={1} ellipsizeMode="tail" style={styles.productTitle}>
          {product.name}
        </FText>
        <FText numberOfLines={2} ellipsizeMode="tail" style={styles.productDescription}>
          {product.description}
        </FText>
        <StarRatingDisplay
          maxStars={5}
          starSize={20}
          starStyle={{ marginHorizontal: 0, marginBottom: 5 }}
          rating={product.averageRating}
        />
        <View style={styles.productPriceContainer}>
          <FText style={styles.productPrice}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              product.price * (1 - product.discount / 100),
            )}
          </FText>
          <FText style={styles.productPriceOld}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </FText>
        </View>
        <TouchableOpacity style={styles.productButton} onPress={() => handleAddToCart(product)}>
          <FText style={styles.productButtonText}>Thêm vào giỏ hàng</FText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);
