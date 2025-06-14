import { useCallback } from 'react';

function useProduct({ getProductsAll, setProducts }: any) {
  const fetchProduct = useCallback(async () => {
    try {
      const res = await getProductsAll();
      setProducts(res);
    } catch (error) {
      throw error;
    }
  }, []);
  return { fetchProduct };
}

export default useProduct;
