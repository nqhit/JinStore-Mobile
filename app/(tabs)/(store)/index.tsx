import styles from '@/assets/styles/Screen/StoreScreen.styles';
import IconShoppingCart from '@/components/IconShoppingCart';
import ProductListStore from '@/components/products/ProductListStore';
import FText from '@/components/Text';
import FTextInput from '@/components/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from 'expo-router';
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { Easing, TouchableOpacity, View } from 'react-native';
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

  const openAnimationConfig = useMemo(
    () => ({
      timing: { duration: 300, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) },
    }),
    [],
  );

  const closeAnimationConfig = useMemo(
    () => ({
      timing: { duration: 250, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) },
    }),
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white', paddingBottom: tabBarHeight / 2 }}
      edges={['top', 'bottom']}
    >
      {/* Header cũ */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchFilter} onPress={onOpen}>
          <Ionicons name="options-outline" size={26} color="black" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <FTextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
        </View>

        <IconShoppingCart />
      </View>

      {/* Nội dung  */}

      <View style={styles.body}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FText style={{ flex: 1, fontSize: 32, fontWeight: 'bold' }}>Danh sách sản phẩm</FText>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <ProductListStore />
        </View>
      </View>

      {/* Modalize với nội dung mẫu */}
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        handleStyle={styles.modalHandle}
        modalStyle={styles.modalStyle}
        overlayStyle={styles.modalOverlay}
        openAnimationConfig={openAnimationConfig}
        closeAnimationConfig={closeAnimationConfig}
      >
        <View style={styles.modalContent}>
          <FText style={styles.modalTitle}>Bộ lọc sản phẩm</FText>

          {filterOptions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.filterOption} activeOpacity={0.8}>
              <FText style={styles.filterText}>{item}</FText>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <FText style={styles.closeButtonText}>Áp dụng</FText>
          </TouchableOpacity>
        </View>
      </Modalize>
    </SafeAreaView>
  );
}
export default memo(StoreScreen);
