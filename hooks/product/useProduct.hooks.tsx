import { productType } from '@/interfaces/product.type';
import { useCallback } from 'react';

function useProduct({ getProductsAll, setProducts }: any) {
  const fetchProduct = useCallback(
    async (page: number, limit: number) => {
      try {
        const res = await getProductsAll(page, limit);
        setProducts((prev: productType[]) => (page === 1 ? res.data : [...prev, ...res.data]));
        return res;
      } catch (error) {
        throw error;
      }
    },
    [getProductsAll, setProducts],
  );
  return { fetchProduct };
}

export default useProduct;
