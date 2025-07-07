import styles from '@/assets/styles/Screen/CouponScreen.styles';
import { CouponList } from '@/components/coupons/CouponList';
import SearchFilter from '@/components/SearchFilter';
import { COLORS } from '@/constants/Colors';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function CartCoupon() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchFilter onOpen={() => {}} />
        </View>
        <View style={styles.body}>
          <CouponList />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CartCoupon;
