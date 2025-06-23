import IconShoppingCart from '@/components/IconShoppingCart';
import ProductListStore from '@/components/products/ProductListStore';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { memo, useLayoutEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StoreScreen() {
  const modalRef = useRef<Modalize>(null);
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const onOpen = () => {
    modalRef.current?.open();
  };

  // Animation cho header mới (search bar)
  const animatedHeaderHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 60],
    extrapolate: 'clamp',
  });

  const animatedHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const staticHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const staticHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

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
      <Animated.View
        style={[
          styles.staticHeader,
          {
            opacity: staticHeaderOpacity,
            transform: [{ translateY: staticHeaderTranslateY }],
          },
        ]}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>

        <ThemedText type="subtitle" style={styles.titleText}>
          Store
        </ThemedText>

        <IconShoppingCart />
      </Animated.View>

      {/* Header mới */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            height: animatedHeaderHeight,
            opacity: animatedHeaderOpacity,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
        </View>
        <TouchableOpacity style={styles.searchFilter} onPress={onOpen}>
          <Ionicons name="options-outline" size={26} color="black" />
        </TouchableOpacity>
      </Animated.View>

      {/* Nội dung có scroll */}
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={8}
        contentContainerStyle={{ paddingTop: 0 }}
      >
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
      </Animated.ScrollView>

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
const styles = StyleSheet.create({
  staticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  HeaderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7a5af8',
    borderRadius: 12,
    paddingHorizontal: 12,
    flex: 1,
    height: 40,
  },
  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7a5af8',
    borderRadius: 12,
    paddingHorizontal: 7,
    height: 40,
    marginLeft: 8,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
  },

  // Body
  body: {
    paddingHorizontal: 15,
    flex: 1,
  },

  modalHandle: {
    backgroundColor: '#ddd',
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  modalStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  filterOption: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    padding: 18,
    backgroundColor: '#7a5af8',
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#7a5af8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
