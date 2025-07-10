import FText from '@/components/Text';
import React from 'react';
import { View } from 'react-native';
import styles from '../../assets/styles/profile/ProfileSection.styles';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <View>
      <FText style={styles.sectionTitle}>{title}</FText>
      {children}
    </View>
  );
}
