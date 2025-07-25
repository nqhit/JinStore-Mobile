import FullScreenLoading from '@/components/loadingGlobal';
import RetryView from '@/components/retryView';
import FText from '@/components/Text';
import FTextInput from '@/components/TextInput';
import { COLORS } from '@/constants/Colors';
import { useTabBarVisibility } from '@/Context/TabBarVisibilityContext';
import { productType } from '@/interfaces/product.type';
import { useCart } from '@/server/hooks/useCart';
import { useProduct } from '@/server/hooks/useProduct';
import { formatCurrency } from '@/utils/FormatCurrency';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';

function ProductDetail() {
  const [data, setData] = useState<productType | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const { addItemToCart } = useCart();
  const params = useLocalSearchParams();
  const { getProdDetail } = useProduct();
  const { setVisible } = useTabBarVisibility();

  const scrollRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 200);
  }, []);

  const handleQuantityChange = useCallback(
    (value = 1) => {
      const maxQuantity = data?.quantity as number;
      let newQuantity = Number(quantity) + value;
      newQuantity = Math.max(1, Math.min(maxQuantity, newQuantity));
      setQuantity(newQuantity.toString());
    },
    [data?.quantity, quantity],
  );

  const handleQuantityInput = (text: string) => {
    if (text === '' || /^\d+$/.test(text)) {
      setQuantity(text);
    }
  };

  const handleQuantityBlur = () => {
    const maxQuantity = data?.quantity || 999;
    let value = Number(quantity);
    if (!quantity || value < 1) value = 1;
    if (value > maxQuantity) value = maxQuantity;
    setQuantity(value.toString());
  };

  const handleAddToCart = useCallback(
    async (product: productType) => {
      if (isAddingToCart) return;

      try {
        setIsAddingToCart(true);
        const res = await addItemToCart(product, Number(quantity));
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
    [addItemToCart, isAddingToCart, quantity],
  );

  const handleBack = useCallback(() => {
    router.replace('/(tabs)/(store)');
  }, []);

  const handlSeeMore = useCallback(() => {
    setShowDescription(!showDescription);
  }, [showDescription]);

  const fetchData = useCallback(async () => {
    if (!params.id) {
      setError('Mã sản phẩm không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getProdDetail(params.id as string);
      setData(res);
    } catch (err) {
      setError('Lỗi khi lấy chi tiết sản phẩm');
      console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  }, [params.id, getProdDetail]);

  const imageSource = useMemo(() => {
    const imageUrl = data?.images?.[0]?.url;
    return imageUrl ? { uri: imageUrl } : require('@/assets/images/placeholder.png');
  }, [data?.images]);

  const discountedPrice = useMemo(() => {
    const price = data?.price as number;
    const discount = data?.discount as number;
    return price * (1 - discount / 100);
  }, [data?.price, data?.discount]);

  const formattedDiscountedPrice = useMemo(() => {
    return formatCurrency(discountedPrice);
  }, [discountedPrice]);

  const formattedOriginalPrice = useMemo(() => {
    return formatCurrency(data?.price as number);
  }, [data?.price]);

  const formattedDescription = useMemo(() => {
    if (!data?.description) return '';
    return data.description.trim().replace(/\n{2,}/g, '\n\n');
  }, [data?.description]);

  useEffect(() => {
    setVisible(false);
    fetchData();
    return () => {
      setVisible(true);
    };
  }, [fetchData, setVisible]);

  if (loading) {
    return <FullScreenLoading visible={loading} />;
  }

  if (error) {
    return <RetryView handleRetry={fetchData} error={error} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <View style={styles.imagesContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={26} color="black" />
          </TouchableOpacity>
          <ImageBackground
            resizeMode="cover"
            source={imageSource}
            style={styles.imageBackground}
            defaultSource={require('@/assets/images/placeholder.png')}
          />
        </View>
        <View style={styles.body}>
          <View style={styles.info}>
            <View style={styles.infoHeader}>
              <View style={styles.productPriceContainer}>
                <FText style={styles.productPrice}>{formattedDiscountedPrice}</FText>
                <FText style={styles.productPriceOld}>{formattedOriginalPrice}</FText>
              </View>
              <FText style={styles.countBuy}>
                Đã bán {data?.countBuy}
                {data?.quantity && data.quantity < 1000 && `/${data?.quantity}`}
              </FText>
            </View>
            <View style={styles.infoBody}>
              {data?.averageRating && data.averageRating > 0 ? (
                <View style={styles.ratingContainer}>
                  <StarRatingDisplay
                    maxStars={5}
                    starSize={20}
                    starStyle={{ marginHorizontal: 0, marginBottom: 5, height: 20 }}
                    rating={data.averageRating}
                  />
                  <FText> {data.averageRating.toFixed(1)}</FText>
                </View>
              ) : (
                <FText numberOfLines={1} ellipsizeMode="tail" style={styles.textReview}>
                  Chưa có đánh giá!
                </FText>
              )}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.btnActionQuantity}
                  disabled={quantity === '' || Number(quantity) <= 1}
                  onPress={() => handleQuantityChange(-1)}
                >
                  <Entypo
                    name="minus"
                    size={24}
                    color={quantity === '' || Number(quantity) <= 1 ? '#ccc' : COLORS.primary}
                  />
                </TouchableOpacity>
                <FTextInput
                  style={styles.quantityInput}
                  value={quantity}
                  keyboardType="number-pad"
                  onChangeText={handleQuantityInput}
                  onBlur={handleQuantityBlur}
                  editable={true}
                  inputMode="numeric"
                  maxLength={3}
                />
                <TouchableOpacity
                  style={styles.btnActionQuantity}
                  disabled={quantity === '' || Number(quantity) >= (data?.quantity || 999)}
                  onPress={() => handleQuantityChange(1)}
                >
                  <Entypo
                    name="plus"
                    size={24}
                    color={quantity === '' || Number(quantity) >= (data?.quantity || 999) ? '#ccc' : COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <FText numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>
                {data?.name}
              </FText>
            </View>
            <View style={styles.description}>
              <View style={styles.desHeader}>
                <FText style={styles.desHeaderTitle}>Thông tin chi tiết </FText>
                <TouchableOpacity onPress={handlSeeMore} style={styles.btnSeeMore}>
                  {showDescription ? (
                    <Entypo name="chevron-up" size={24} color="black" />
                  ) : (
                    <Entypo name="chevron-down" size={24} color="black" />
                  )}
                </TouchableOpacity>
              </View>
              <FText style={styles.descriptionText} numberOfLines={showDescription ? undefined : 10}>
                {formattedDescription}
              </FText>
            </View>
          </View>
        </View>
      </ScrollView>
      {showButton && (
        <TouchableOpacity style={styles.btnScrollTop} onPress={scrollToTop}>
          <AntDesign name="arrowup" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <View style={styles.footer}>
        <View style={styles.tabBtn}>
          <View style={styles.bottomLeft}>
            <TouchableOpacity style={styles.btnAddToCart} onPress={() => handleAddToCart(data as productType)}>
              <FText style={styles.txtAddToCart}>Thêm vào giỏ hàng</FText>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomRight}>
            <TouchableOpacity style={styles.btnBuyNow}>
              <FText style={styles.txtBuyNow}>Mua ngay</FText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  btnScrollTop: {
    position: 'absolute',
    bottom: '15%',
    right: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 25,
    elevation: 5,
  },

  imagesContainer: {
    position: 'relative',
    backgroundColor: '#f2f2f2',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 2,
  },

  imageBackground: {
    width: '100%',
    height: 250,
  },

  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    flex: 1,
    paddingTop: 15,
  },

  info: {
    paddingHorizontal: 20,
    flex: 1,
    gap: 2,
  },

  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: COLORS.gray200,
    alignSelf: 'center',
    gap: 5,
  },

  btnActionQuantity: {
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray50,
  },

  quantityInput: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'center',
    minWidth: 50,
  },

  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },

  productPrice: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: 800,
  },

  productPriceOld: {
    fontSize: 14,
    color: COLORS.gray600,
    textDecorationLine: 'line-through',
    alignItems: 'flex-end',
  },

  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    alignSelf: 'flex-start',
  },

  countBuy: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '600',
    textAlign: 'right',
  },

  ratingContainer: {
    flexDirection: 'row',
  },

  textReview: {
    marginBottom: 5,
    fontSize: 16,
    height: 20,
    textAlign: 'left',
    alignContent: 'center',
    color: 'red',
  },

  description: {
    backgroundColor: COLORS.gray50,
    borderRadius: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  desHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  desHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },

  btnSeeMore: {
    alignSelf: 'flex-end',
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },

  descriptionText: {
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#222',
    lineHeight: 26,
    fontWeight: '400',
    textAlign: 'justify',
  },

  footer: {
    borderTopWidth: 1,
    borderColor: COLORS.gray200,
  },

  tabBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: COLORS.gray200,
  },

  bottomLeft: {
    flex: 1,
    marginRight: 8,
  },

  bottomRight: {
    flex: 1,
    marginLeft: 8,
  },

  btnAddToCart: {
    backgroundColor: COLORS.gray200,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnBuyNow: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txtAddToCart: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '600',
  },

  txtBuyNow: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
export default ProductDetail;
