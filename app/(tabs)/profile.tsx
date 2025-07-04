// ./(tabs)/index.tsx
import styles from '@/assets/styles/Screen/ProfileScreen.styles';
import FText from '@/components/Text';
import { createAxios } from '@/server/axiosInstance';
import { logOut } from '@/server/services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../redux/slices/authSlice';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();
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
        await AsyncStorage.multiRemove([
          'user',
          'accessToken',
          'refreshToken',
          'persist:root', // Nếu bạn dùng redux-persist
        ]);
        router.replace('/(auth)/login');
      }
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id, accessToken, axiosJWT_V2]);

  // Hiển thị loading trong khi kiểm tra
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <FText>Profile</FText>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FText style={{ color: '#000' }}>Logout</FText>
      </TouchableOpacity>
    </View>
  );
}
