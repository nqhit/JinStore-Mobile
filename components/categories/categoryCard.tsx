import styles from '@/assets/styles/category/categoryCard.styles';
import FText from '@/components/Text';
import { COLORS } from '@/constants/Colors';
import { categoryType } from '@/interfaces/category.type';
import { memo } from 'react';
import { Image, TouchableOpacity } from 'react-native';

function CategoryCard({
  category,
  onSubmit,
  selected,
}: {
  category: categoryType;
  onSubmit: (id: string) => void;
  selected?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.categoryContainer, selected && { borderBottomWidth: 1, borderBottomColor: COLORS.primary }]}
      onPress={() => onSubmit(category._id)}
    >
      <Image
        source={{ uri: category.image?.url || '@/assets/images/placeholder.png' }}
        style={styles.image}
        resizeMode="contain"
      />
      <FText numberOfLines={1} ellipsizeMode="tail" style={[styles.name, selected && { color: COLORS.primary }]}>
        {category.name}
      </FText>
    </TouchableOpacity>
  );
}

export default memo(CategoryCard);
