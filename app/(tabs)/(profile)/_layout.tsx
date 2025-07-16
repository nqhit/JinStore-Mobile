import { useCouponStore } from '@/hooks/useCouponStore';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function ProfileScreen() {
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
          headerShown: false,
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
          animation: 'slide_from_right',
          headerLeft: () => {
            return (
              <TouchableOpacity style={{ marginRight: 15 }} onPress={handleBack}>
                <Ionicons name="chevron-back" size={26} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            title: 'Thông tin cá nhân',
          }}
        />
        <Stack.Screen name="(address)" />
      </Stack>
    </SafeAreaProvider>
  );
}

export default ProfileScreen;
