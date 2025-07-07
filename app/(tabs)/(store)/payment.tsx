// payment.tsx
import FText from '@/components/Text';
import { CartItemType } from '@/interfaces/cart.type';
import { Entypo } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function PaymentScreen() {
  const { data, feeDiscount, total } = useLocalSearchParams();
  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    try {
      // Parse dữ liệu từ string về array
      const parsedIds = data ? JSON.parse(data as string) : [];
      setSelectedItems(parsedIds);

      // Parse số tiền
      setDiscountAmount(Number(feeDiscount) || 0);
      setTotalAmount(Number(total) || 0);
    } catch (error) {
      console.error('Error parsing payment params:', error);
      // Xử lý lỗi hoặc redirect về trang trước
    }
  }, [data, feeDiscount, total]);

  if (!data) {
    return (
      <View>
        <FText>Không có dữ liệu thanh toán</FText>
      </View>
    );
  }

  return (
    <View>
      <FText style={{ color: 'red', justifyContent: 'center', alignItems: 'center' }}>
        Giảm giá: <Entypo name="minus" size={14} color="red" />
        {discountAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
      </FText>
      <FText>Tổng tiền: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</FText>
      <View>
        {selectedItems.map((item) => (
          <FText key={item._id}>{item.name}</FText>
        ))}
      </View>
      <FText>Số lượng sản phẩm: {selectedItems.length}</FText>
    </View>
  );
}
