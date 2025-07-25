import { categoryType } from '@/interfaces/category.type';
import useCategory from '@/server/hooks/useCategory';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CategoryCard from './CategoryCard';

export const CategoryList = ({
  handleSubmit,
  selectedId,
}: {
  handleSubmit: (id: string) => void;
  selectedId?: string;
}) => {
  const [categories, setCategories] = useState<categoryType[]>([]);
  const { getCategoriesAll } = useCategory();

  useEffect(() => {
    getCategoriesAll().then((res) => setCategories(res));
  }, [getCategoriesAll]);

  const featuredCategories = Array.isArray(categories)
    ? categories.filter((category: categoryType) => category.status === 'active')
    : [];

  const renderCategoryItem = useCallback(
    ({ item }: { item: categoryType }) => (
      <CategoryCard onSubmit={() => handleSubmit(item._id)} category={item} selected={selectedId === item._id} />
    ),
    [handleSubmit, selectedId],
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
    // borderWidth: 1,
    // borderColor: COLORS.gray200,
    // borderRadius: 8,
  },
});
