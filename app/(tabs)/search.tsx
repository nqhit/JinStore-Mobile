import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Platform, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ✅ Tự tạo header custom */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? 30 : 20,
          backgroundColor: '#fff',
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
            autoFocus={true}
          />
        </View>
      </View>

      <View style={{ flex: 1, padding: 16 }}>{}</View>
    </View>
  );
}
