import styles from '@/assets/styles/Screen/CartScreen.styles';
import CartItem from '@/components/carts/CartItem';
import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import { COUPON_MESSAGES } from '@/constants/message';
import { useTabBarVisibility } from '@/Context/TabBarVisibilityContext';
import { useCouponStore } from '@/hooks/useCouponStore';
import { CartItemType } from '@/interfaces/cart.type';
import { CouponValidation } from '@/interfaces/coupon.type';
import { useCart } from '@/server/hooks/useCart';
import { formatCurrency } from '@/utils/FormatCurrency';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function CartDetails() {
  const { setVisible } = useTabBarVisibility();

  useEffect(() => {
    setVisible(false);

    return () => setVisible(true);
  }, []);

  // State
  const [data, setData] = useState<CartItemType[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // Hooks
  const { couponItem, clearCouponCode } = useCouponStore();
  const { getCart, deleteItemInCart, updateItemInCart } = useCart();

  // Computed values
  const isAllSelected = selectedItems.length === data.length && data.length > 0;

  // Data fetching
  const handleFetchData = useCallback(async () => {
    try {
      const res = await getCart();
      setData(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setData([]);
    }
  }, [getCart]);

  // Validation
  const isValidCartData = useMemo(() => {
    return data.every(
      (item) =>
        item._id &&
        typeof item.quantity === 'number' &&
        item.quantity > 0 &&
        typeof item.discountPrice === 'number' &&
        item.discountPrice >= 0,
    );
  }, [data]);

  // Calculations
  const subtotal = useMemo(() => {
    if (!isValidCartData) {
      console.warn('Invalid cart data detected');
      return 0;
    }

    return selectedItems.reduce((total, item) => {
      const itemTotal = item.discountPrice * item.quantity;
      return isNaN(itemTotal) || itemTotal < 0 ? total : total + itemTotal;
    }, 0);
  }, [selectedItems, isValidCartData]);

  const couponValidation = useMemo((): CouponValidation => {
    if (selectedItems.length === 0) {
      return {
        canApply: false,
        reason: 'NO_ITEMS_SELECTED',
        message: COUPON_MESSAGES.NO_ITEMS_SELECTED,
      };
    }

    if (!couponItem) {
      return {
        canApply: false,
        reason: 'NO_COUPON',
        message: COUPON_MESSAGES.NO_COUPON,
      };
    }

    if (!couponItem.type || !couponItem.discount) {
      return {
        canApply: false,
        reason: 'INVALID_COUPON',
        message: COUPON_MESSAGES.INVALID_COUPON,
      };
    }

    if (couponItem.minOrderAmount !== undefined && subtotal < couponItem.minOrderAmount) {
      return {
        canApply: false,
        reason: 'INSUFFICIENT_AMOUNT',
        message: COUPON_MESSAGES.INSUFFICIENT_AMOUNT(couponItem.minOrderAmount),
      };
    }

    return {
      canApply: true,
      reason: 'VALID',
      message: COUPON_MESSAGES.VALID,
    };
  }, [selectedItems.length, couponItem, subtotal]);

  const couponDiscount = useMemo(() => {
    if (!couponValidation.canApply || !couponItem) return 0;

    try {
      let discount = 0;

      if (couponItem.type === 'percentage') {
        const percent = couponItem.discount || 0;
        if (percent < 0 || percent > 100) return 0;
        discount = (subtotal * percent) / 100;
      } else if (couponItem.type === 'fixed') {
        discount = Math.min(couponItem.discount || 0, subtotal);
      }

      return Math.max(0, Math.round(discount));
    } catch (error) {
      console.error('Error calculating coupon discount:', error);
      return 0;
    }
  }, [couponValidation.canApply, couponItem, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - couponDiscount);
  }, [subtotal, couponDiscount]);

  // Event handlers
  const handleChangeQuantity = useCallback(
    async (itemId: string, change: number, oldQuantity: number) => {
      const newQuantity = oldQuantity + change;

      if (newQuantity < 1) {
        Alert.alert('Thông báo', 'Số lượng không thể nhỏ hơn 1');
        return;
      }

      try {
        await updateItemInCart(itemId, change, oldQuantity);
        setData((prevItems) =>
          prevItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)),
        );
        setSelectedItems((prevItems) =>
          prevItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)),
        );
      } catch (error) {
        console.error('Error updating quantity:', error);
        Alert.alert('Lỗi', 'Không thể cập nhật số lượng');
      }
    },
    [updateItemInCart],
  );

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa sản phẩm này?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItemInCart(itemId);
              setData((prevItems) => prevItems.filter((item) => item._id !== itemId));
              setSelectedItems((prevSelected) => prevSelected.filter((p) => p._id !== itemId));
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
            }
          },
        },
      ]);
    },
    [deleteItemInCart],
  );

  const handleSelectAll = useCallback(() => {
    setSelectedItems(isAllSelected ? [] : [...data]);
  }, [isAllSelected, data]);

  const handleToggleSelect = useCallback((item: CartItemType) => {
    setSelectedItems((prev) => {
      const exists = prev.find((p) => p._id === item._id);
      return exists ? prev.filter((p) => p._id !== item._id) : [...prev, item];
    });
  }, []);

  const handleNavigateToCoupon = useCallback(() => {
    if (isNavigating) return;

    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn sản phẩm để áp dụng mã giảm giá');
      return;
    }

    setIsNavigating(true);
    router.push({
      pathname: '/coupon',
      params: { total: subtotal },
    });

    setTimeout(() => setIsNavigating(false), 1000);
  }, [isNavigating, selectedItems.length, subtotal]);

  const handleNavigateToCheckout = useCallback(() => {
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn sản phẩm để thanh toán');
      return;
    }

    const finalDiscount = couponValidation.canApply ? couponDiscount : 0;
    const finalTotal = subtotal - finalDiscount;

    if (finalTotal < 0) {
      Alert.alert('Lỗi', 'Có lỗi trong tính toán. Vui lòng thử lại.');
      return;
    }

    router.push({
      pathname: '/payment',
      params: {
        data: JSON.stringify(selectedItems),
        feeDiscount: finalDiscount,
        total: finalTotal,
        couponCode: couponValidation.canApply ? couponItem?.code : undefined,
      },
    });
  }, [selectedItems, couponValidation.canApply, couponDiscount, subtotal, couponItem]);

  // Render functions
  const renderCartItem = useCallback(
    ({ item }: { item: CartItemType }) => (
      <CartItem
        itemCart={item}
        isSelected={selectedItems.some((p) => p._id === item._id)}
        handleQuantityChange={handleChangeQuantity}
        handleDeleteItem={handleDeleteItem}
        onToggleSelect={() => handleToggleSelect(item)}
      />
    ),
    [selectedItems, handleChangeQuantity, handleDeleteItem, handleToggleSelect],
  );

  const keyExtractor = useCallback((item: CartItemType, index: number) => {
    return `${item._id || `temp-${index}`}-${index}`;
  }, []);

  const renderCouponWarning = useCallback(() => {
    if (!couponItem || couponValidation.canApply) return null;

    return (
      <View style={styles.couponWarning}>
        <MaterialIcons name="warning" size={16} color={COLORS.warning} />
        <FText style={styles.warningText}>{couponValidation.message}</FText>
        <TouchableOpacity onPress={clearCouponCode}>
          <FText style={styles.removeText}>Xóa</FText>
        </TouchableOpacity>
      </View>
    );
  }, [couponItem, couponValidation, clearCouponCode]);

  const renderDiscountSection = useCallback(
    () => (
      <View>
        <TouchableOpacity disabled={isNavigating} onPress={handleNavigateToCoupon}>
          <View style={styles.footerTop}>
            <View style={styles.discountContainer}>
              <MaterialIcons name="discount" size={24} color={COLORS.primary} />
              <FText style={styles.discountText}>Khuyến mãi</FText>
            </View>
            <View style={styles.discountContainer}>
              <View style={styles.couponLeft}>
                <FText>
                  {couponValidation.canApply && couponItem?.type === 'percentage'
                    ? `${couponItem?.discount}%`
                    : formatCurrency(couponDiscount)}
                </FText>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </View>
          </View>
        </TouchableOpacity>
        {renderCouponWarning()}
      </View>
    ),
    [isNavigating, handleNavigateToCoupon, couponValidation, couponItem, couponDiscount, renderCouponWarning],
  );

  const renderEmptyCart = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Image source={require('@/assets/images/cartEmpty.png')} style={styles.emptyImage} />
      </View>
    ),
    [],
  );

  const renderFooter = useCallback(
    () => (
      <View style={styles.footer}>
        {renderDiscountSection()}

        <View style={styles.footerBottom}>
          <View style={styles.containerCheckBoxAll}>
            <TouchableOpacity style={styles.btnCheckBoxAll} onPress={handleSelectAll}>
              <Ionicons
                name={isAllSelected ? 'checkbox-sharp' : 'square-outline'}
                size={26}
                color={isAllSelected ? COLORS.primary : COLORS.gray500}
              />
              <FText style={styles.selectAll}>Tất cả ({selectedItems.length})</FText>
            </TouchableOpacity>
          </View>

          <View style={styles.footerLeft}>
            <View
              style={[
                styles.totalContainer,
                selectedItems.length > 0 && couponDiscount > 0 && { alignItems: 'flex-end' },
              ]}
            >
              <FText style={styles.total}>{formatCurrency(total)}</FText>
              {selectedItems.length > 0 && couponDiscount > 0 && (
                <View style={styles.amountSaveContainer}>
                  <FText style={styles.saveText}>Tiết kiệm: </FText>
                  <FText style={styles.amountSave}>{formatCurrency(couponDiscount)}</FText>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleNavigateToCheckout}
              style={[styles.btnCheckout, selectedItems.length === 0 && styles.btnDisabled]}
              disabled={selectedItems.length === 0}
            >
              <FText style={styles.textCheckout}>
                Thanh toán {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
              </FText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [
      renderDiscountSection,
      handleSelectAll,
      isAllSelected,
      selectedItems,
      total,
      couponDiscount,
      handleNavigateToCheckout,
    ],
  );

  // Effects
  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <View style={styles.body}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={renderCartItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            extraData={selectedItems}
          />
        ) : (
          renderEmptyCart()
        )}
      </View>

      {data.length > 0 && renderFooter()}
    </SafeAreaView>
  );
}

export default memo(CartDetails);
