// ./(tabs)/index.tsx
import styles from '@/assets/styles/Screen/ProfileScreen.styles';
import FText from '@/components/Text';
import { useAuth } from '@/server/hooks/useAuth';
import { useCallback, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [logout]);

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
