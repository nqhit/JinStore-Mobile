import { productService } from '@/server/services/product.service';
import { useCallback } from 'react';

export const useProduct = () => {
  const getProductsAll = useCallback(async (page: number, limit: number) => {
    return await productService.getProductsAll(page, limit);
  }, []);

  const getProdDetail = useCallback(async (id: string) => {
    return await productService.getProdDetail(id);
  }, []);
  return { getProductsAll, getProdDetail };
};
