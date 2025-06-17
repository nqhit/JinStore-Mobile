import { useCallback } from 'react';

function useCategory({ getCategoriesAll, setCategories }: any) {
  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategoriesAll();
      setCategories(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  }, [getCategoriesAll, setCategories]);
  return { fetchCategories };
}

export default useCategory;
