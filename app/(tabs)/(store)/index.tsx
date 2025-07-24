import styles from '@/assets/styles/Screen/StoreScreen.styles';
import { CategoryList } from '@/components/categories/CategoryList';
import IconShoppingCart from '@/components/IconShoppingCart';
import FModalize from '@/components/Modal';
import ProductListStore from '@/components/products/ProductListStore';
import SearchFilter from '@/components/SearchFilter';
import FText from '@/components/Text';
import { useTabBarVisibility } from '@/Context/TabBarVisibilityContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function StoreScreen() {
  const insets = useSafeAreaInsets();
  const { setVisible } = useTabBarVisibility();
  const tabBarHeight = useBottomTabBarHeight();
  const modalRef = useRef<Modalize>(null);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [_idCategory, setIdCategory] = useState<string>('');
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    setVisible(true);
  }, []);

  const idCategory = useMemo(() => {
    if (hasUserSelected) return _idCategory;
    return id || '';
  }, [hasUserSelected, _idCategory, id]);

  const onOpen = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const onClose = useCallback(() => {
    modalRef.current?.close();
  }, []);

  const filterOptions = useMemo(() => ['Giá: Thấp đến cao', 'Giá: Cao đến thấp', 'Mới nhất'], []);

  const handleSelectId = useCallback(
    (id: string) => {
      if (!hasUserSelected) setHasUserSelected(true);
      setIdCategory((prev) => (prev === id ? '' : id));
    },
    [hasUserSelected],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, []),
  );

  useEffect(() => {
    setHasUserSelected(false);
    setIdCategory('');
  }, [id]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top, paddingBottom: tabBarHeight + insets.bottom }}
      edges={['left', 'right', 'bottom']}
    >
      <View style={styles.header}>
        <SearchFilter onOpen={onOpen} />
        <IconShoppingCart />
      </View>

      <View style={styles.body}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#e5e5e5',
            borderBottomWidth: 1,
          }}
        >
          <CategoryList handleSubmit={handleSelectId} selectedId={idCategory as string} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <ProductListStore _idCate={idCategory as string} />
        </View>
      </View>

      <FModalize modalRef={modalRef}>
        <FText style={styles.modalTitle}>Bộ lọc sản phẩm</FText>

        {filterOptions.map((item, index) => (
          <TouchableOpacity key={index} style={styles.filterOption} activeOpacity={0.8}>
            <FText style={styles.filterText}>{item}</FText>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={{ ...styles.closeButton, marginBottom: insets.bottom + 40 }}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <FText style={styles.closeButtonText}>Áp dụng</FText>
        </TouchableOpacity>
      </FModalize>
    </SafeAreaView>
  );
}
export default memo(StoreScreen);
