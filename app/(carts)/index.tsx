import styles from '@/assets/styles/Screen/CartScreen.styles';
import CartCard from '@/components/carts/CartCard';
import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import useCart from '@/hooks/cart/useCart.hooks';
import useChangeQuantity from '@/hooks/cart/useChangeQuantity.hooks';
import useDeleteItem from '@/hooks/cart/useDeleteItem.hooks';
import { CartItemType } from '@/interfaces/cart.type';
import { loginSuccess } from '@/redux/slices/authSlice';
import { createAxios } from '@/utils/createInstance';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

function CartDetails() {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [data, setData] = useState<CartItemType[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);

  const isAllSelected = selectedItems.length === data.length;

  const { fetchCartItems } = useCart({ accessToken, axiosJWT });
  const { fetchDeleteItem } = useDeleteItem({ accessToken, axiosJWT });
  const { fetchQuantityChange } = useChangeQuantity({
    accessToken,
    axiosJWT,
  });

  const handleFetchData = useCallback(() => {
    fetchCartItems().then((res) => {
      setData(Array.isArray(res?.data) ? res.data : []);
    });
  }, [fetchCartItems]);

  // NOTE: Thay đổi số lượng hàng hóa
  const handleChangeQuantity = (itemId: string, change: number, oldQuantity: number) => {
    fetchQuantityChange(itemId, change, oldQuantity).then((res) => {
      const newQuantity = oldQuantity + change;
      setData((prevItems) =>
        prevItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)),
      );
    });
  };

  // NOTE: Xóa sản phẩm trong giỏ hàng
  const handleDeleteItem = (itemId: string) => {
    fetchDeleteItem(itemId).then((res) => {
      setData((prevItems) => prevItems.filter((item) => item._id !== itemId));
      setSelectedItems((prevSelected) => prevSelected.filter((p) => p._id !== itemId));
    });
  };

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.filter((item) => item));
    }
  }, [isAllSelected, data]);

  const handleToggleSelect = (item: CartItemType) => {
    setSelectedItems((prev) => {
      const exists = prev.find((p) => p._id === item._id);
      if (exists) {
        return prev.filter((p) => p._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleRouterCheckout = useCallback(() => {
    const selectedIds = selectedItems.map((item) => item._id);
    router.push({
      pathname: '/payment',
      params: {
        data: JSON.stringify(selectedIds),
        feeDiscount: JSON.stringify(calculateCouponDiscount),
        total: JSON.stringify(calculateSubtotal),
      },
    });
  }, [selectedItems]);

  const renderCartItem = ({ item }: { item: CartItemType }) => (
    <CartCard
      itemCart={item}
      isSelected={selectedItems.some((p) => p._id === item._id)}
      handleQuantityChange={handleChangeQuantity}
      handleDeleteItem={handleDeleteItem}
      onToggleSelect={() => handleToggleSelect(item)}
    />
  );

  const keyExtractorCartItem = (item: CartItemType, index: number) => {
    const id = item._id?.toString() || `temp-${index}`;
    return `${id}-${index}`;
  };

  const calculateSubtotal = useMemo(() => {
    return data.reduce((total, item) => {
      const isSelected = selectedItems.some((selected) => selected._id === item._id);
      if (isSelected) {
        return total + item.discountPrice * item.quantity;
      }
      return total;
    }, 0);
  }, [data, selectedItems]);

  // Cập nhật hàm tính toán giảm giá từ coupon
  const calculateCouponDiscount = useMemo(() => {
    return 0;
  }, []);

  const calculateTotal = useMemo(() => {
    return calculateSubtotal + calculateCouponDiscount;
  }, [calculateSubtotal, calculateCouponDiscount]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      {/*       <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <FText style={styles.title}>Giỏ hàng</FText>
        <TouchableOpacity onPress={handleRouterStore}>
          <Ionicons name={'storefront-outline'} size={24} />
        </TouchableOpacity>
      </View> */}
      <View style={styles.body}>
        <View style={styles.containerCheckBoxAll}>
          <TouchableOpacity style={styles.btnCheckBoxAll} onPress={handleSelectAll}>
            <Ionicons
              name={selectedItems.length === data.length && data.length > 0 ? 'checkbox-sharp' : 'square-outline'}
              size={26}
              color={selectedItems.length === data.length && data.length > 0 ? COLORS.primary : COLORS.gray500}
            />
            <FText style={styles.selectAll}>Chọn tất cả ({selectedItems.length})</FText>
          </TouchableOpacity>
          {selectedItems.length > 0 && (
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={26} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
        {data.length > 0 ? (
          <>
            <FlatList
              data={data}
              renderItem={renderCartItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractorCartItem}
            />
            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <FText style={styles.label}>Thành tiền: </FText>
                <FText>{calculateSubtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</FText>
              </View>
              <View style={styles.totalContainer}>
                <FText style={styles.label}>Giảm giá: </FText>
                <FText>{calculateCouponDiscount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</FText>
              </View>
              <View style={styles.totalContainer}>
                <FText style={styles.label}>Thanh toán:</FText>
                <FText>{calculateTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</FText>
              </View>
              <TouchableOpacity
                onPress={handleRouterCheckout}
                style={[styles.btnCheckout, selectedItems.length === 0 && styles.btnDisabled]}
                disabled={selectedItems.length === 0}
              >
                <MaterialIcons name="shopping-cart-checkout" size={26} color="white" />
                <FText style={styles.textCheckout}>Thanh toán</FText>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={require('@/assets/images/cartEmpty.png')} style={styles.emptyImage} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default memo(CartDetails);
