import styles from '@/assets/styles/category/categoryCard.styles';
import { categoryType } from '@/interfaces/category.type';
import { Image, Text, TouchableOpacity } from 'react-native';

function CategoryCard({ category }: { category: categoryType }) {
  return (
    <TouchableOpacity style={styles.categoryContainer}>
      <Image
        source={{ uri: category.image?.url || 'https://via.placeholder.com/100' }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

export default CategoryCard;
