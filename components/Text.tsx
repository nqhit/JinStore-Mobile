// components/Text.tsx
import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

export default function FText(props: TextProps) {
  return <RNText {...props} allowFontScaling={false} style={[styles.default, props.style]} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: '#000',
  },
});
