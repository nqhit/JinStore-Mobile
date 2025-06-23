import styles from '@/assets/styles/Screen/StoreScreen.styles';
import IconShoppingCart from '@/components/IconShoppingCart';
import ProductListStore from '@/components/products/ProductListStore';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { memo, useLayoutEffect, useRef } from 'react';
import { Easing, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StoreScreen() {
  const modalRef = useRef<Modalize>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const onOpen = () => {
    modalRef.current?.open();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header cũ */}
      <View style={styles.staticHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
        </View>

        <IconShoppingCart />
      </View>

      {/* Nội dung  */}

      <View style={styles.body}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemedText style={{ flex: 1 }} type="title">
            Danh sách sản phẩm
          </ThemedText>
          {/* Thêm onPress={onOpen} cho button filter này */}
          <TouchableOpacity style={styles.searchFilter} onPress={onOpen}>
            <Ionicons name="options-outline" size={26} color="black" />
          </TouchableOpacity>
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
        openAnimationConfig={{
          timing: { duration: 300, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) },
        }}
        closeAnimationConfig={{
          timing: { duration: 250, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) },
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bộ lọc sản phẩm</Text>

          {['Giá: Thấp đến cao', 'Giá: Cao đến thấp', 'Mới nhất'].map((item, index) => (
            <TouchableOpacity key={index} style={styles.filterOption} activeOpacity={0.8}>
              <Text style={styles.filterText}>{item}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeButton} onPress={() => modalRef.current?.close()} activeOpacity={0.8}>
            <Text style={styles.closeButtonText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </View>
  );
}
export default memo(StoreScreen);
