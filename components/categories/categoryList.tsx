import { COLORS } from '@/constants/Colors';
import { categoryType } from '@/interfaces/category.type';
import useCategory from '@/server/hooks/useCategory';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CategoryCard from './categoryCard';

export const CategoryList = ({ handleSubmit }: { handleSubmit: () => void }) => {
  const [categories, setCategories] = useState<categoryType[]>([]);
  const { getCategoriesAll } = useCategory();

  useEffect(() => {
    getCategoriesAll().then((res) => setCategories(res));
  }, [getCategoriesAll]);

  const featuredCategories = Array.isArray(categories)
    ? categories.filter((category: categoryType) => category.status === 'active')
    : [];

  const renderCategoryItem = ({ item }: { item: categoryType }) => (
    <CategoryCard handleRouterStore={handleSubmit} category={item} />
  );

  const keyExtractorCategory = (item: categoryType, index: number) => item._id?.toString() || index.toString();
  return (
    <View style={styles.categoryListContainer}>
      <FlatList
        data={featuredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={keyExtractorCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryListContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    minHeight: 100,
  },
});
