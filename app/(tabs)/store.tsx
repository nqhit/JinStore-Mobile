import { ThemedText } from '@/components/ThemedText';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useLayoutEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100], // cuộn lên đến 100px thì header hiện ra
    outputRange: [0, 60], // ẩn => hiện
    extrapolate: 'clamp',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? 30 : 20,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginRight: 12,
          }}
        >
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>

        <ThemedText type="subtitle" style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}>
          Store
        </ThemedText>

        {/* Search bar */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: 40,
            paddingRight: 10,
          }}
        >
          <AntDesign name="shoppingcart" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={
          (styles.header,
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: Platform.OS === 'ios' ? 30 : 20,
            backgroundColor: '#fff',
            opacity: headerHeight.interpolate({
              inputRange: [0, 60],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            height: headerHeight,
          })
        }
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginRight: 12,
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Search bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#7a5af8',
            borderRadius: 12,
            paddingHorizontal: 12,
            flex: 1,
            height: 40,
          }}
        >
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Tìm kiếm..."
            style={{
              marginLeft: 8,
              flex: 1,
              paddingVertical: 0,
              fontSize: 16,
            }}
          />
        </View>
      </Animated.View>

      <View style={{ flex: 1, padding: 16 }}>{}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#7a5af8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
