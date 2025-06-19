import { Stack } from 'expo-router';

export default function AUthLayout() {
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
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
