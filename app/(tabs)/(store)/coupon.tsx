import FText from '@/components/Text';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function CartCoupon() {
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}>
      <View>
        <FText>CartCoupon</FText>
      </View>
    </SafeAreaView>
  );
}

export default CartCoupon;
