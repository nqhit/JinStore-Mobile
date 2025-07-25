import { COLORS } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

const FullScreenLoading = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FullScreenLoading;
