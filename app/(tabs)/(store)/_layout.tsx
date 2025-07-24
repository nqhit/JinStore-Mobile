import { useCouponStore } from '@/hooks/useCouponStore';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function CartScreen() {
  const { clearCouponCode } = useCouponStore();
  const handleBack = useCallback(() => {
    clearCouponCode();
    router.back();
  }, [clearCouponCode]);
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          gestureEnabled: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
          animation: 'slide_from_right',
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={handleBack}>
                <Ionicons name="chevron-back" size={26} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen
          name="cart"
          options={{
            headerTitle: 'Giỏ hàng',
          }}
        />
        <Stack.Screen name="checkout" options={{ title: 'Thanh toán' }} />
        <Stack.Screen name="coupon" options={{ title: 'Mã giảm giá' }} />
        <Stack.Screen name="ProdDetail/[id]" options={{ headerShown: false, animation: 'none' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

export default CartScreen;
