import { COLORS } from '@/constants/Colors';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import FText from './Text';

function RetryView({ handleRetry, error }: { handleRetry: () => void; error: string }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.errorContainer}>
        <FText style={styles.errorText}>{error && 'Có lỗi vui lòng thử lại'}</FText>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <FText style={styles.retryText}>Thử lại</FText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
export default RetryView;
