import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styles from '../../assets/styles/profile/ProfileItem.styles';

type ValidPathname = '/profile' | '/settings' | '/orders' | '/address'; // Thêm route tùy theo dự án của bạn

interface ProfileItemProps {
  text: string;
  value?: string;
  pathname?: ValidPathname;
  showChevron?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export default function ProfileItem({
  text,
  value,
  pathname,
  showChevron = true,
  testID,
  accessibilityLabel,
}: ProfileItemProps) {
  const handleRouter = useCallback(() => {
    if (pathname) {
      router.push(pathname as any);
    }
  }, [pathname]);

  const isNavigable = !!pathname;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={isNavigable ? handleRouter : undefined}
      activeOpacity={isNavigable ? 0.6 : 1}
      disabled={!isNavigable}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      <FText style={styles.itemText}>{text}</FText>
      <View style={styles.itemValueContainer}>
        {value && <FText style={styles.itemValue}>{value}</FText>}
        {showChevron && <Entypo name="chevron-right" size={24} color={COLORS.black} />}
      </View>
    </TouchableOpacity>
  );
}
