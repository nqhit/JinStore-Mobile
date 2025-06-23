import styles from '@/assets/styles/category/categoryCard.styles';
import { categoryType } from '@/interfaces/category.type';
import { memo } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

function CategoryCard({ category, handleRouterStore }: { category: categoryType; handleRouterStore: () => void }) {
  return (
    <TouchableOpacity style={styles.categoryContainer} onPress={handleRouterStore}>
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

export default memo(CategoryCard);
