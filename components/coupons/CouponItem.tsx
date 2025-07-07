import { COLORS } from '@/constants/Colors';
import { useCouponStore } from '@/hooks/useCouponStore';
import { CouponType } from '@/interfaces/coupon.type';
import { formatCurrency } from '@/utils/FormatCurrency';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FText from '../Text';

export const CouponItem = ({ coupon }: { coupon: CouponType }) => {
  const code = coupon.code;
  const status = coupon.isActive ? 'Đang hoạt động' : 'Không hoạt động';
  const discount = coupon.type === 'fixed' ? `${formatCurrency(coupon.value ?? 0)} VND` : `${coupon.maxPercent}%`;
  const minOrder = formatCurrency(coupon.minOrderAmount);
  const activation = new Date(coupon.activation).toLocaleDateString('vi-VN');
  const expiration = new Date(coupon.expiration).toLocaleDateString('vi-VN');
  const remaining = coupon.quantityLimit - coupon.quantityUsed;
  const total = coupon.quantityLimit;
  const percent = remaining / total;

  const router = useRouter(); // hoặc navigation = useNavigation()
  const { setCouponItem } = useCouponStore();

  const handleApplyCoupon = async () => {
    setCouponItem({
      code: coupon.code,
      type: coupon.type,
      discount: coupon.type === 'fixed' ? coupon.value : coupon.maxPercent,
    });
    await Clipboard.setStringAsync(code);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <FText style={styles.code}>{code}</FText>
        <View style={styles.statusBadge}>
          <FText style={styles.statusText}>{status}</FText>
        </View>
        <TouchableOpacity style={styles.copyBtn} onPress={handleApplyCoupon}>
          <FText style={styles.copyText}>Áp dụng</FText>
        </TouchableOpacity>
      </View>
      <FText style={styles.discount}>{discount}</FText>
      <FText style={styles.minOrder}>
        Đơn tối thiểu: <FText style={styles.minOrderValue}>{minOrder}</FText>
      </FText>
      <View style={styles.divider} />
      <View style={styles.infoRow}>
        <FText style={styles.infoLabel}>Hạn sử dụng:</FText>
        <FText style={styles.infoValue}>{expiration}</FText>
      </View>
      <View style={styles.infoRow}>
        <FText style={styles.infoLabel}>Ngày kích hoạt:</FText>
        <FText style={styles.infoValue}>{activation}</FText>
      </View>
      <View style={styles.infoRow}>
        <FText style={styles.infoLabel}>Còn lại:</FText>
        <FText style={styles.infoValue}>
          {remaining}/{total}
        </FText>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percent * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  code: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#4B3CF7',
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: '#E6F7EC',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 'auto',
  },
  statusText: {
    color: '#3CB371',
    fontSize: 12,
    fontWeight: '500',
  },
  copyBtn: {
    backgroundColor: '#4B3CF7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  copyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discount: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
    marginBottom: 2,
  },
  minOrder: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  minOrderValue: {
    color: '#888',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
  },
  infoValue: {
    color: '#222',
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#4B3CF7',
    borderRadius: 8,
  },
});
