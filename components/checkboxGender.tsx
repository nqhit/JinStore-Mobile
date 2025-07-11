import { COLORS } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import FText from './Text';

type Props = {
  gender: string;
  values: any;
  textGender: string;
  setFieldValue: (field: string, value: any) => void;
  isLoading: boolean;
};

const CheckboxGender: React.FC<Props> = ({ gender, values, textGender, setFieldValue, isLoading }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
      onPress={() => setFieldValue('gender', gender)}
      disabled={isLoading}
    >
      <MaterialCommunityIcons
        name={values.gender === gender ? 'radiobox-marked' : 'radiobox-blank'}
        size={20}
        color={COLORS.primary}
      />
      <View style={{ marginLeft: 4 }}>
        <FText>{textGender}</FText>
      </View>
    </TouchableOpacity>
  );
};

export default CheckboxGender;
