import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { loginSuccess } from '../redux/authSlice';
import { persistor, store } from '../store/store';

function AppWithStore() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          setLoadingUser(true);
          const userData = JSON.parse(userString);

          // Verify user data structure
          if (userData && userData._id) {
            dispatch(loginSuccess(userData));
            router.replace('/(tabs)');
          } else {
            console.log('Invalid user data in storage, clearing...');
            await AsyncStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        await AsyncStorage.removeItem('user'); // Clear corrupted data
      }
      setLoadingUser(false);
    };
    loadUser();
  }, [dispatch]);

  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

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
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="+not-found"
                options={{
                  title: 'Oops!',
                  presentation: 'modal',
                }}
              />
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

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppWithStore />
        </PersistGate>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  statusBarContainer: {
    height: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    backgroundColor: '#8B5CF6',
  },
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
