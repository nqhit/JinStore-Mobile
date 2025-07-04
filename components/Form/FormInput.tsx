// components/FormInputGroup.tsx
import FText from '@/components/Text';
import FTextInput from '@/components/TextInput';
import { COLORS } from '@/constants/Colors';
import React from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputConfig {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words';
  editable?: boolean;
  error?: string;
  touched?: boolean;
}

interface ButtonConfig {
  isFormValid: boolean;
  isLoading: boolean;
  handleFunc: () => void;
}

interface FormInputGroupProps {
  inputs: InputConfig[];
  button: ButtonConfig;
  placeholderTextColor?: string;
  text: string;
}

const FormInputGroup: React.FC<FormInputGroupProps> = ({
  inputs,
  button: { isFormValid, isLoading, handleFunc },
  placeholderTextColor = '#999',
  text = 'Submit',
}) => {
  return (
    <>
      <View style={[styles.inputGroup]}>
        {inputs.map((input, index) => (
          <View
            style={[styles.inputContainer, input.error && input.touched ? { marginBottom: 0 } : { marginBottom: 23.3 }]}
            key={index}
          >
            <FTextInput
              aria-label="input"
              style={[styles.input, input.error && input.touched && styles.inputError]}
              placeholder={input.placeholder}
              placeholderTextColor={placeholderTextColor}
              value={input.value}
              onChangeText={input.onChangeText}
              onBlur={input.onBlur}
              secureTextEntry={input.secureTextEntry}
              keyboardType={input.keyboardType || 'default'}
              autoCapitalize={input.autoCapitalize || 'none'}
              autoCorrect={false}
              editable={input.editable}
            />
            {input.error && input.touched && <FText style={styles.errorText}>{input.error}</FText>}
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.btnSuccess /* , (!isFormValid || isLoading) && styles.btnDisabled */]}
        onPress={handleFunc}
        /* disabled={!isFormValid || isLoading} */
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <FText style={styles.btnText}>{text}</FText>
        )}
      </TouchableOpacity>
    </>
  );
};

export default FormInputGroup;

const styles = StyleSheet.create({
  inputGroup: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'left',
    fontSize: 13,
    paddingBottom: 5,
  },
  btnSuccess: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnDisabled: {
    backgroundColor: COLORS.gray300,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
