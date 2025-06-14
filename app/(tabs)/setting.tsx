// ./(tabs)/index.tsx
import styles from '@/assets/styles/Screen/SettingScreen.styles';
import { ThemedText } from '@/components/ThemedText';
import { logOut } from '@/server/auth.server';
import { createAxios } from '@/utils/createInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../redux/authSlice';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: any) => state.auth.login.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT_V2 = createAxios(user, dispatch, logoutSuccess);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await logOut(dispatch, id, accessToken, axiosJWT_V2);
      if (res.success) {
        await AsyncStorage.removeItem('user');
        router.replace('/(auth)/login');
      }
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id, accessToken, axiosJWT_V2]);
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Text>Profile</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText style={{ color: '#000' }}>Logout</ThemedText>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
}
