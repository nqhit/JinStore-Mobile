import { styles } from '@/assets/styles/address/AddressCard.styles';
import { COLORS } from '@/constants/Colors';
import { AddressType } from '@/interfaces/address.type';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import FText from '../Text';

function AddressCard({ value, onEdit, onDelete }: { value: AddressType; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <View style={{ ...styles.container, borderColor: value.isDefault ? COLORS.greenBase : COLORS.black }}>
      <View style={styles.info}>
        {value.isDefault ? (
          <FText style={styles.default}>Mặc định</FText>
        ) : (
          <TouchableOpacity style={styles.undefault}>
            <FText>Sử dụng</FText>
          </TouchableOpacity>
        )}
        <FText>{value.detailed}</FText>
        <FText>{`${value.district}, ${value.city}, ${value.province}`}</FText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Feather name="edit" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} disabled={value.isDefault}>
          <MaterialIcons name="delete" size={22} color={value.isDefault ? COLORS.black_032 : COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AddressCard;
