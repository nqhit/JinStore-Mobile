// components/Text.tsx
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

export default function FText(props: TextProps) {
  return <Text {...props} allowFontScaling={false} style={[styles.default, props.style]} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: '#000',
  },
});
