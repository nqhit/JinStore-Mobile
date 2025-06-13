import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
