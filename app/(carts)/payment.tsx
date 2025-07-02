import FText from '@/components/Text';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Payment() {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']}>
      <View>
        <FText>Thanh toán</FText>
      </View>
    </SafeAreaView>
  );
}

export default Payment;
