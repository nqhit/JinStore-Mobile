import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast } from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Loading from '@/components/loading';
import socket from '@/config/socket';
import { COLORS } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { persistor, store } from '@/redux/store';

const SCREEN_WIDTH = Dimensions.get('screen').width;

// Theme configurations
const createCustomTheme = (isDark: boolean) => {
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: COLORS.primary,
      background: isDark ? COLORS.black : COLORS.white,
    },
  };
};

// Toast configuration
const createToastConfig = () => ({
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: COLORS.greenBase,
        backgroundColor: COLORS.whiteMint,
        paddingVertical: 0,
        fontSize: 16,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.green800,
      }}
      text2Style={{
        fontSize: 12,
        color: COLORS.greenBase,
      }}
    />
  ),
});

// Stack screen options
const getStackScreenOptions = () => ({
  headerShown: false,
  gestureEnabled: true,
  animation: 'slide_from_right' as const,
});

// Custom hook for socket connection
const useSocketConnection = () => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);
};

// App component with store and navigation
function AppWithStore() {
  const colorScheme = useColorScheme();

  useSocketConnection();

  const theme = createCustomTheme(colorScheme === 'dark');

  return (
    <>
      <View style={styles.statusBarContainer}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      </View>
      <SafeAreaProvider>
        <ThemeProvider value={theme}>
          <View style={styles.container}>
            <AppNavigator />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  );
}

// Navigation stack component
function AppNavigator() {
  return (
    <Stack screenOptions={getStackScreenOptions()}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen
        name="+not-found"
        options={{
          title: 'Oops!',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

// Font loader hook
const useFontLoader = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return loaded;
};

// Main root layout component
export default function RootLayout() {
  const fontsLoaded = useFontLoader();
  const toastConfig = createToastConfig();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain" // hoặc 'cover' nếu muốn phủ hết
        />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <GestureHandlerRootView style={styles.gestureContainer}>
          <AppWithStore />
        </GestureHandlerRootView>
        <Toast config={toastConfig} />
      </PersistGate>
    </Provider>
  );
}

// Styles
const styles = StyleSheet.create({
  statusBarContainer: {
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    width: SCREEN_WIDTH,
  },
  gestureContainer: {
    flex: 1,
  },
});
