// ./(tabs)/index.tsx
import styles from '@/assets/styles/Screen/ProfileScreen.styles';
import ActionAccountButton from '@/components/Button/ActionAccountButton';
import { ProfileFooter, ProfileHeader, ProfileItem, ProfileSection } from '@/components/Profile';
import FText from '@/components/Text';
import { resetLogoutState } from '@/server/auth.helper';
import { useAuth } from '@/server/hooks/useAuth';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const user = useCurrentUser() || {};

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

  const handleUpdateAvatar = useCallback(() => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile pressed');
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <FText style={{ marginTop: 10 }}>Đang đăng xuất...</FText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader user={user} onEditPress={handleUpdateAvatar} />

        <ProfileSection title="Cá nhân">
          <ProfileItem text="Hồ sơ" pathname="/profile" />
          <ProfileItem text="Sổ địa chỉ" pathname="/(address)" />
          <ProfileItem text="Phương thức thanh toán" />
          <ProfileItem text="Đổi mật khẩu" />
        </ProfileSection>

        <ProfileSection title="Thiết lập">
          <ProfileItem text="Quốc gia" value="Việt Nam" />
          <ProfileItem text="Tiền tệ" value="VND" />
          <ProfileItem text="Điều khoản dịch vụ" />
        </ProfileSection>

        <ProfileSection title="Tài khoản">
          <ProfileItem text="Ngôn ngữ" value="vietnamese" />
          <ProfileItem text="Về chúng tôi" />
        </ProfileSection>

        <ActionAccountButton text="Đăng xuất" onPress={handleLogout} />

        {/* Footer */}
        <ProfileFooter />
      </ScrollView>
    </SafeAreaView>
  );
}
