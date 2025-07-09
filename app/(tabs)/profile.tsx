// ./(tabs)/index.tsx
import styles from '@/assets/styles/Screen/ProfileScreen.styles';
import FText from '@/components/Text';
import { resetLogoutState } from '@/server/auth.helper';
import { useAuth } from '@/server/hooks/useAuth';
import { useCallback, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    if (loading) return; // Prevent multiple logout calls

    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
      resetLogoutState();
    }
  }, [logout, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <FText style={{ marginTop: 10 }}>Đang đăng xuất...</FText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <FText>Profile</FText>
      <TouchableOpacity
        style={[styles.logoutButton, loading && { opacity: 0.5 }]}
        onPress={handleLogout}
        disabled={loading}
      >
        <FText style={{ color: '#000' }}>Logout</FText>
      </TouchableOpacity>
    </View>
  );
}
