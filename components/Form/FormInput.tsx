// components/FormInputGroup.tsx
import FTextInput from '@/components/TextInput';
import { COLORS } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import FText from '../Text';

interface InputConfig {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words';
  editable?: boolean;
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
      {inputs.map((input, index) => (
        <FTextInput
          key={index}
          style={styles.input}
          placeholder={input.placeholder}
          placeholderTextColor={placeholderTextColor}
          value={input.value}
          onChangeText={input.onChangeText}
          secureTextEntry={input.secureTextEntry}
          keyboardType={input.keyboardType || 'default'}
          autoCapitalize={input.autoCapitalize || 'none'}
          autoCorrect={false}
          editable={input.editable}
        />
      ))}
      <TouchableOpacity
        style={[styles.btnSuccess, (!isFormValid || isLoading) && styles.btnDisabled]}
        onPress={handleFunc}
        disabled={!isFormValid || isLoading}
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
  // Input field
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 16,
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

  // Login button
  btnSuccess: {
    width: '100%',
    height: 50,
    marginTop: 10,
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
