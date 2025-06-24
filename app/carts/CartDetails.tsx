import styles from '@/assets/styles/Screen/CartScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { memo, useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function CartDetails() {
  const navigation = useNavigation();

  const handleRouterStore = useCallback(() => {
    router.push('/(tabs)/store');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Giỏ hàng</Text>
        <TouchableOpacity onPress={handleRouterStore}>
          <Ionicons name={'storefront-outline'} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default memo(CartDetails);
