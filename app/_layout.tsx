import { socket } from '@/config/socket';
import { useColorScheme } from '@/hooks/useColorScheme';
import { persistor, store } from '@/redux/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast } from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

function AppWithStore() {
  const colorScheme = useColorScheme();

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#8B5CF6',
      background: '#FFFFFF',
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#8B5CF6',
      background: '#000000',
    },
  };

  return (
    <>
      <View style={styles.statusBarContainer}>
        <StatusBar translucent barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      </View>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
          <View style={styles.container}>
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(search)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'Oops!', presentation: 'modal' }} />
            </Stack>
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#4CAF50', backgroundColor: '#F0FFF0', paddingVertical: 0 }}
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
        text1Style={{ fontSize: 16, fontWeight: '500', color: '#2E7D32' }}
        text2Style={{ fontSize: 12, color: '#4CAF50' }}
      />
    ),
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AppWithStore />
        <Toast config={toastConfig} />
      </PersistGate>
    </Provider>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#8B5CF6" />
    </View>
  );
}

const styles = StyleSheet.create({
  statusBarContainer: {
    height: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    backgroundColor: '#8B5CF6',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    width: Dimensions.get('screen').width,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
