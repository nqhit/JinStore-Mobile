// components/TextInput.tsx
import React from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';

export default function FTextInput(props: TextInputProps) {
  return (
    <RNTextInput
      {...props}
      allowFontScaling={false}
      placeholderTextColor="#888" // bạn có thể custom theo theme
    />
  );
}
