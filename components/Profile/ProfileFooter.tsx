import styles from '@/assets/styles/profile/ProfileFooter.styles';
import FText from '@/components/Text';
import Constants from 'expo-constants';
import React from 'react';
import { View } from 'react-native';

interface ProfileFooterProps {
  appName?: string;
  copyright?: string;
}

export default function ProfileFooter({ appName = 'JinStore' }: ProfileFooterProps) {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const currentYear = new Date().getFullYear();
  return (
    <View style={styles.footer}>
      <FText style={styles.appName}>{appName}</FText>
      <FText style={styles.copyright}>
        @Copyright {currentYear} - Version {version}
      </FText>
    </View>
  );
}
