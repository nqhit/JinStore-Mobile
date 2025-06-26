// components/TextInput.tsx
import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export default function FTextInput(props: TextInputProps) {
  return (
    <TextInput {...props} allowFontScaling={false} placeholderTextColor="#888" style={[styles.default, props.style]} />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: '#000',
  },
});
