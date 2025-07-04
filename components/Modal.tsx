import { COLORS } from '@/constants/Colors';
import { useMemo } from 'react';
import { Easing, StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';

function FModalize({ modalRef, children }: { modalRef: any; children: any }) {
  const openAnimationConfig = useMemo(
    () => ({
      timing: { duration: 300, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) },
    }),
    [],
  );

  const closeAnimationConfig = useMemo(
    () => ({
      timing: { duration: 250, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) },
    }),
    [],
  );
  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      handleStyle={styles.modalHandle}
      modalStyle={styles.modalStyle}
      overlayStyle={styles.modalOverlay}
      openAnimationConfig={openAnimationConfig}
      closeAnimationConfig={closeAnimationConfig}
    >
      <View style={styles.modalContent}>{children}</View>
    </Modalize>
  );
}

export default FModalize;

const styles = StyleSheet.create({
  modalHandle: {
    backgroundColor: COLORS.gray200,
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  modalStyle: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOverlay: {
    backgroundColor: COLORS.black_032,
  },

  modalContent: {
    padding: 24,
  },
});
