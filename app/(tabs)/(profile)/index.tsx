// ./(tabs)/index.tsx
import ActionAccountButton from '@/components/Button/ActionAccountButton';
import Loading from '@/components/loading';
import { ProfileFooter, ProfileHeader, ProfileItem, ProfileSection } from '@/components/Profile';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/server/hooks/useAuth';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const user = useCurrentUser() || {};
  const tabBarHeight = useBottomTabBarHeight();

  const handleLogout = useCallback(async () => {
    if (loading) return;

    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
          } catch (error) {
            console.error('Lỗi đăng xuất:', error);
            Alert.alert('Lỗi', 'Không thể đăng xuất');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }, [logout, loading]);

  const handleUpdateAvatar = useCallback(() => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile pressed');
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={{ ...styles.container, marginBottom: tabBarHeight }}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader user={user} onEditPress={handleUpdateAvatar} />

        <ProfileSection title="Cá nhân">
          <ProfileItem text="Hồ sơ" pathname="/profile" />
          <ProfileItem text="Sổ địa chỉ" pathname="/(address)" />
          <ProfileItem text="Phương thức thanh toán" />
          <ProfileItem
            text="Đổi mật khẩu"
            pathname="/(auth)/ActionsPassword"
            params={{
              showCurrentPassword: true,
            }}
          />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
});
