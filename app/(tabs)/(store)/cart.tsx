import styles from '@/assets/styles/Screen/CartScreen.styles';
import CartItem from '@/components/carts/CartItem';
import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import useCart from '@/hooks/cart/useCart.hooks';
import useChangeQuantity from '@/hooks/cart/useChangeQuantity.hooks';
import useDeleteItem from '@/hooks/cart/useDeleteItem.hooks';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { CartItemType } from '@/interfaces/cart.type';
import { loginSuccess } from '@/redux/slices/authSlice';
import { createAxios } from '@/utils/createInstance';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const formatCurrency = (value: number) => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

function CartDetails() {
  useHideTabBar();
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

  const renderCartItem = ({ item }: { item: CartItemType }) => (
    <CartItem
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
    return calculateSubtotal - calculateCouponDiscount;
  }, [calculateSubtotal, calculateCouponDiscount]);

  const handleRouterCheckout = useCallback(() => {
    const selectedIds = selectedItems.map((item) => item);
    router.push({
      pathname: '/payment',
      params: {
        data: JSON.stringify(selectedIds),
        feeDiscount: calculateCouponDiscount,
        total: calculateSubtotal,
      },
    });
  }, [selectedItems, calculateCouponDiscount, calculateSubtotal]);

  const handleRouterCoupon = useCallback(() => {
    router.push('/coupon');
  }, []);

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
        {data.length > 0 ? (
          <>
            <FlatList
              data={data}
              renderItem={renderCartItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractorCartItem}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={require('@/assets/images/cartEmpty.png')} style={styles.emptyImage} />
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleRouterCoupon}>
          <View style={styles.footerTop}>
            <View style={styles.discountContainer}>
              <MaterialIcons name="discount" size={24} color={COLORS.primary} />
              <FText style={styles.discountText}>Khuyến mãi</FText>
            </View>
            <View style={styles.discountContainer}>
              <View style={styles.couponLeft}>
                <FText>{formatCurrency(calculateCouponDiscount)}</FText>
              </View>
              <View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.footerBottom}>
          <View style={styles.containerCheckBoxAll}>
            <TouchableOpacity style={styles.btnCheckBoxAll} onPress={handleSelectAll}>
              <Ionicons
                name={selectedItems.length === data.length && data.length > 0 ? 'checkbox-sharp' : 'square-outline'}
                size={26}
                color={selectedItems.length === data.length && data.length > 0 ? COLORS.primary : COLORS.gray500}
              />
              <View>
                <FText style={styles.selectAll}>Tất cả ({selectedItems.length})</FText>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.footerLeft}>
            <View style={styles.totalContainer}>
              <FText style={styles.total}>{formatCurrency(calculateTotal)}</FText>
              {selectedItems.length > 0 && (
                <View style={styles.amountSaveContainer}>
                  <FText style={styles.saveText}>Tiết kiệm: </FText>
                  <FText style={styles.amountSave}>{calculateCouponDiscount}</FText>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={handleRouterCheckout}
              style={[styles.btnCheckout, selectedItems.length === 0 && styles.btnDisabled]}
              disabled={selectedItems.length === 0}
            >
              <FText style={styles.textCheckout}>Thanh toán </FText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default memo(CartDetails);
