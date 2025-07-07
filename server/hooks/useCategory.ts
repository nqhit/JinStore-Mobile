import { categoryService } from '@/server/services/category.service';
import { useCallback } from 'react';

function useCategory() {
  const getCategoriesAll = useCallback(async () => {
    try {
      return await categoryService.getCategoriesAll();
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  }, []);
  return { getCategoriesAll };
}

export default useCategory;
