import { FormProfile } from '@/components/Form/FormProfile';
import { COLORS } from '@/constants/Colors';
import { useKeyboardPadding } from '@/hooks/useKeyboardPadding';
import { ProfileFormValues } from '@/interfaces/user.type';
import { useCurrentUser } from '@/server/hooks/useCurrentUser';
import { useUser } from '@/server/hooks/useUser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const user = useCurrentUser();
  const { updateInfoUser } = useUser();
  const keyboardPadding = useKeyboardPadding(20);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = useCallback(
    async (values: ProfileFormValues) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        await updateInfoUser(values);
        router.back();
      } catch (error) {
        console.error('Update profile error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, updateInfoUser],
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: keyboardPadding / 2 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.avatarWrapper}>
              <Image
                style={styles.avatar}
                source={{
                  uri: user?.avatar?.url || 'https://ui-avatars.com/api/?name=User',
                }}
              />
              <TouchableOpacity style={styles.editIcon} onPress={() => {}}>
                <MaterialCommunityIcons name="pencil" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <FormProfile isLoading={isLoading} onSubmit={handleUpdateProfile} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },

  content: {
    flex: 1,
    gap: 10,
    height: '100%',
    position: 'relative',
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});
