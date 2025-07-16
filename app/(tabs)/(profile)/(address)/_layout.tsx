import { useCouponStore } from '@/hooks/useCouponStore';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AddressScreen() {
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
          headerTitleAlign: 'left',
          headerBackVisible: false,
          headerShown: true,
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
          headerLeft: () => {
            return (
              <TouchableOpacity style={{ marginRight: 15 }} onPress={handleBack}>
                <Ionicons name="chevron-back" size={26} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Địa chỉ giao hàng' }} />
        <Stack.Screen name="actionsAddress" options={{ title: 'Thêm địa chỉ' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

export default AddressScreen;
