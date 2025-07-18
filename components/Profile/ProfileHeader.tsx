import FText from '@/components/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import styles from '../../assets/styles/profile/ProfileHeader.styles';

interface ProfileHeaderProps {
  user?: {
    avatar?: {
      url?: string;
    };
    fullname?: string;
    email?: string;
  };
  onEditPress?: () => void;
}
function ProfileHeader({ user, onEditPress }: ProfileHeaderProps) {
  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');

    if (username.length <= 3) {
      return username[0] + '*'.repeat(username.length - 1) + '@' + domain;
    }

    const firstTwo = username.slice(0, 2);
    const lastChar = username.slice(-1);
    const maskedMiddle = '*'.repeat(username.length - username.length + 3);

    return `${firstTwo}${maskedMiddle}${lastChar}@${domain}`;
  };
  return (
    <View style={styles.profile}>
      <View style={styles.avatarWrapper}>
        <Image
          style={styles.avatar}
          source={{
            uri: user?.avatar?.url || 'https://ui-avatars.com/api/?name=User',
          }}
        />
        <TouchableOpacity style={styles.editIcon} onPress={onEditPress}>
          <MaterialCommunityIcons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FText style={styles.name}>{user?.fullname || 'Tên người dùng'}</FText>
      <FText style={styles.email}>{maskEmail(user?.email as string) || 'email@example.com'}</FText>
    </View>
  );
}

export default memo(ProfileHeader);
