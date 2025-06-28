import styles from '@/assets/styles/cart/CartCard.styles';
import { COLORS } from '@/constants/Colors';
import { CartItemType } from '@/interfaces/cart.type';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import FText from '../Text';

function CartCard({
  itemCart,
  isSelected,
  onToggleSelect,
  handleQuantityChange,
}: {
  itemCart: CartItemType;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  handleQuantityChange: (itemId: string, change: number, oldQuantity: number) => void;
}) {
  const handleToggleSelect = useCallback(() => {
    onToggleSelect(itemCart._id);
  }, [itemCart._id, onToggleSelect]);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleToggleSelect}>
        <Ionicons
          name={isSelected ? 'checkbox-sharp' : 'square-outline'}
          size={26}
          color={isSelected ? COLORS.primary : '#8E8E93'}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: itemCart.images[0].url }} style={styles.image} />
        </View>
        <View style={styles.info}>
          <View style={styles.topInfo}>
            <FText style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {itemCart.name}
            </FText>
          </View>
          <View style={styles.bottomInfo}>
            <View style={styles.cartItemPriceContainer}>
              <FText style={styles.discountPrice}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemCart.discountPrice)}
              </FText>
            </View>
            <View style={styles.cartItemQuantityContainer}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(itemCart._id, -1, itemCart.quantity)}
                disabled={itemCart.quantity === 1}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={28}
                  color={itemCart.quantity <= 1 ? '#ccc' : COLORS.primary}
                />
              </TouchableOpacity>
              <FText style={styles.quantity}>{itemCart.quantity}</FText>
              <TouchableOpacity onPress={() => handleQuantityChange(itemCart._id, 1, itemCart.quantity)}>
                <Ionicons name="add-circle-outline" size={28} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CartCard;
