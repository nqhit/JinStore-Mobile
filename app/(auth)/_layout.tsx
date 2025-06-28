import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        gestureEnabled: false,
        animation: 'slide_from_right',
        /* headerLeft */
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Đăng ký',
          headerTitleStyle: { color: 'black' },
        }}
      />
    </Stack>
  );
}
