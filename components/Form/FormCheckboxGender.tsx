import { COLORS } from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';

import FText from '../Text';
import CheckboxGender from '../checkboxGender';

export const FormCheckboxGender = ({ values, setFieldValue, isLoading, errors, touched }: any) => {
  return (
    <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
        <CheckboxGender
          gender="male"
          values={values}
          textGender="Nam"
          setFieldValue={setFieldValue}
          isLoading={isLoading}
        />
        <CheckboxGender
          gender="female"
          values={values}
          textGender="Nữ"
          setFieldValue={setFieldValue}
          isLoading={isLoading}
        />
        <CheckboxGender
          gender="other"
          values={values}
          textGender="Khác"
          setFieldValue={setFieldValue}
          isLoading={isLoading}
        />
      </View>
      {errors.gender && touched.gender && <FText style={styles.errorText}>{errors.gender}</FText>}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: COLORS.error,
    textAlign: 'left',
    fontSize: 13,
    paddingBottom: 5,
  },
});
