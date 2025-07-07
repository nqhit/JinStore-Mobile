import { productService } from '@/server/services/product.service';
import { useCallback } from 'react';

function useProduct() {
  const getProductsAll = useCallback(async (page: number, limit: number) => {
    try {
      return await productService.getProductsAll(page, limit);
    } catch (error) {
      throw error;
    }
  }, []);
  return { getProductsAll };
}

export default useProduct;
