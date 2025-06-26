import styles from '@/assets/styles/Screen/CartScreen.styles';
import CartCard from '@/components/carts/CartCard';
import FText from '@/components/Text';
import useCart from '@/hooks/cart/useCart.hooks';
import useChangeQuantity from '@/hooks/cart/useChangeQuantity.hooks';
import { CartItemType } from '@/interfaces/cart.type';
import { loginSuccess } from '@/redux/slices/authSlice';
import { createAxios } from '@/utils/createInstance';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

function CartDetails() {
  const navigation = useNavigation();
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [data, setData] = useState<CartItemType[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const isAllSelected = selectedItems.length === data.length;

  const { fetchCartItems } = useCart({ accessToken, axiosJWT });

  const handleFetchData = useCallback(() => {
    fetchCartItems().then((res) => {
      setData(res?.data || []);
    });
  }, [fetchCartItems]);

  const { fetchQuantityChange } = useChangeQuantity({
    accessToken,
    axiosJWT,
  });

  const handleChangeQuantity = (itemId: string, change: number, oldQuantity: number) => {
    fetchQuantityChange(itemId, change, oldQuantity).then((res) => {
      const newQuantity = oldQuantity + change;
      setData((prevItems) =>
        prevItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)),
      );
    });
  };

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item._id));
    }
  }, [isAllSelected, data]);

  const handleToggleSelect = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleRouterStore = useCallback(() => {
    router.push('/(tabs)/store');
  }, []);

  const renderCartItem = ({ item }: { item: CartItemType }) => (
    <CartCard
      itemCart={item}
      isSelected={selectedItems.includes(item._id)}
      handleQuantityChange={handleChangeQuantity}
      onToggleSelect={handleToggleSelect}
    />
  );

  const keyExtractorCartItem = (item: CartItemType, index: number) => {
    const id = item._id?.toString() || `temp-${index}`;
    return `${id}-${index}`;
  };

  const calculateSubtotal = useMemo(() => {
    return data.reduce((total, item) => {
      if (selectedItems.includes(item._id)) {
        return total + item.discountPrice * item.quantity;
      }
      return total;
    }, 0);
  }, [data, selectedItems]);

  const calculateShipping = useMemo(() => {
    return selectedItems.length > 0 ? (calculateSubtotal >= 500000 ? 0 : 30000) : 0;
  }, [calculateSubtotal, selectedItems]);

  // Cập nhật hàm tính toán giảm giá từ coupon
  const calculateCouponDiscount = useMemo(() => {
    return 0;
  }, []);

  const calculateTotal = useMemo(() => {
    return calculateSubtotal + calculateShipping - calculateCouponDiscount;
  }, [calculateSubtotal, calculateCouponDiscount, calculateShipping]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <FText style={styles.title}>Giỏ hàng</FText>
        <TouchableOpacity onPress={handleRouterStore}>
          <Ionicons name={'storefront-outline'} size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.containerCheckBoxAll}>
          <TouchableOpacity style={styles.btnCheckBoxAll} onPress={handleSelectAll}>
            <Ionicons
              name={selectedItems.length === data.length && data.length > 0 ? 'checkbox-sharp' : 'square-outline'}
              size={26}
              color={selectedItems.length === data.length && data.length > 0 ? '#8B5CF6' : '#8E8E93'}
            />
            <FText style={styles.selectAll}>Chọn tất cả ({selectedItems.length})</FText>
          </TouchableOpacity>
          {selectedItems.length > 0 && (
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={26} color="#8B5CF6" />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={data}
          renderItem={renderCartItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractorCartItem}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <FText style={styles.label}>Thành tiền: </FText>
          <FText>{calculateSubtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</FText>
        </View>
        <View style={styles.totalContainer}>
          <FText style={styles.label}>Phí vận chuyển: </FText>
          <FText>{calculateShipping.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</FText>
        </View>
        <View style={styles.totalContainer}>
          <FText style={styles.label}>Thanh toán:</FText>
          <FText>{calculateTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</FText>
        </View>
        {calculateShipping !== 0 && (
          <View style={styles.notiContainer}>
            <FText style={styles.notification}>Miễn phí vận chuyển với đơn hàng trên 500.000đ</FText>
          </View>
        )}
        <TouchableOpacity style={styles.btnCheckout}>
          <MaterialIcons name="shopping-cart-checkout" size={26} color="white" />
          <FText style={styles.textCheckout}>Thanh toán</FText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default memo(CartDetails);
