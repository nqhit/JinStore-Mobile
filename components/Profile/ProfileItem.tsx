import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styles from '../../assets/styles/profile/ProfileItem.styles';

interface ProfileItemProps {
  text: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

export default function ProfileItem({ text, value, onPress, showChevron = true }: ProfileItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <FText style={styles.itemText}>{text}</FText>
      {value ? (
        <View style={styles.itemValueContainer}>
          <FText style={styles.itemValue}>{value}</FText>
          {showChevron && <Entypo name="chevron-right" size={24} color={COLORS.black} />}
        </View>
      ) : (
        showChevron && <Entypo name="chevron-right" size={24} color={COLORS.black} />
      )}
    </TouchableOpacity>
  );
}
