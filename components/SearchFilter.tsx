import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import FTextInput from './TextInput';

function SearchFilter({ onOpen }: { onOpen: () => void }) {
  const handleOutsideTouch = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideTouch}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchFilter} onPress={onOpen}>
          <Ionicons name="options-outline" size={26} color="black" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <FTextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SearchFilter;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 12,
    paddingHorizontal: 12,
    flex: 1,
    height: 40,
  },
  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 12,
    paddingHorizontal: 7,
    height: 40,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
  },
});
