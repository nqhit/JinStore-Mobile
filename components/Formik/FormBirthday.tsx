import { COLORS } from '@/constants/Colors';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import FText from '../Text';

export const FormikBirthday = ({ values, showDatePicker, isLoading, errors, touched }: any) => {
  return (
    <View
      style={[
        styles.inputContainer,
        errors.dateBirth && touched.dateBirth ? { marginBottom: 0 } : { marginBottom: 22.3 },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.btnContainer,
          {
            backgroundColor: isLoading ? COLORS.gray200 : 'white',
            borderColor: errors.dateBirth && touched.dateBirth ? 'red' : COLORS.gray200,
          },
        ]}
        onPress={showDatePicker}
        disabled={isLoading}
      >
        <FText
          style={{
            textAlign: 'left',
            color: values.dateBirth ? COLORS.black : COLORS.gray500,
          }}
        >
          {values.dateBirth || 'Ngày sinh (dd/mm/yyyy)'}
        </FText>
      </TouchableOpacity>

      {errors.dateBirth && touched.dateBirth && <FText style={styles.errorText}>{errors.dateBirth}</FText>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  btnContainer: {
    borderWidth: 1,
    height: 51,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'left',
    fontSize: 13,
    paddingBottom: 5,
  },
});
