import styles from '@/assets/styles/Screen/StoreScreen.styles';
import IconShoppingCart from '@/components/IconShoppingCart';
import FModalize from '@/components/Modal';
import ProductListStore from '@/components/products/ProductListStore';
import SearchFilter from '@/components/SearchFilter';
import FText from '@/components/Text';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from 'expo-router';
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { SafeAreaView } from 'react-native-safe-area-context';

function StoreScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const modalRef = useRef<Modalize>(null);
  const navigation = useNavigation();

  const onOpen = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const onClose = useCallback(() => {
    modalRef.current?.close();
  }, []);

  const filterOptions = useMemo(() => ['Giá: Thấp đến cao', 'Giá: Cao đến thấp', 'Mới nhất'], []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white', paddingBottom: tabBarHeight / 2 }}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <View style={styles.header}>
        <SearchFilter onOpen={onOpen} />
        <IconShoppingCart />
      </View>

      <View style={styles.body}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FText style={{ flex: 1, fontSize: 32, fontWeight: 'bold' }}>Danh sách sản phẩm</FText>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <ProductListStore />
        </View>
      </View>

      <FModalize modalRef={modalRef}>
        <FText style={styles.modalTitle}>Bộ lọc sản phẩm</FText>

        {filterOptions.map((item, index) => (
          <TouchableOpacity key={index} style={styles.filterOption} activeOpacity={0.8}>
            <FText style={styles.filterText}>{item}</FText>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
          <FText style={styles.closeButtonText}>Áp dụng</FText>
        </TouchableOpacity>
      </FModalize>
    </SafeAreaView>
  );
}
export default memo(StoreScreen);
