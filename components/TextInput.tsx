// components/TextInput.tsx
import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

(TextInput as any).defaultProps = (Text as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;

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
