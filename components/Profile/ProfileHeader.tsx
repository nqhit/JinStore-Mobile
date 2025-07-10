import FText from '@/components/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
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

export default function ProfileHeader({ user, onEditPress }: ProfileHeaderProps) {
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
      <FText style={styles.email}>{user?.email || 'email@example.com'}</FText>
    </View>
  );
}
