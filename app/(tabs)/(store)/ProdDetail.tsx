import FText from '@/components/Text';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
function ProductDetail() {
  useHideTabBar();
  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']}>
      <View>
        <FText>ProductDetail</FText>
      </View>
    </SafeAreaView>
  );
}

export default ProductDetail;
