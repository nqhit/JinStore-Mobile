import styles from '@/assets/styles/products/ProductCard.styles';
import { Image, Text, View } from 'react-native';

function ProductCard({ product }) {
  return (
    <View style={styles.product}>
      <View style={styles.productImage}>
        <Image source={{ uri: product.images[0]?.url }} style={styles.productImage} />
      </View>
      <View style={styles.productInfo}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.productTitle}>
          {product.name}
        </Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productDescription}>
          {product.description}
        </Text>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              product.price * (1 - product.discount / 100),
            )}
          </Text>
          <Text style={styles.productPriceOld}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default ProductCard;
