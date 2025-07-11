import styles from '@/assets/styles/Screen/CartScreen.styles';
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
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerShown: false,
          animation: 'slide_from_right',
          headerTitleStyle: styles.title,
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={handleBack}>
                <Ionicons name="chevron-back" size={26} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
      </Stack>
    </SafeAreaProvider>
  );
}

export default ProfileScreen;
