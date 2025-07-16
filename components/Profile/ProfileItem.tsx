import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import { useSingledPush } from '@/hooks/useSignlePush';
import { Entypo } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styles from '../../assets/styles/profile/ProfileItem.styles';

interface ProfileItemProps {
  text: string;
  value?: string;
  pathname?: string;
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
  const singlePush = useSingledPush();

  const handleRouter = useCallback(() => {
    if (pathname) {
      singlePush(pathname);
    }
  }, [singlePush, pathname]);

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
