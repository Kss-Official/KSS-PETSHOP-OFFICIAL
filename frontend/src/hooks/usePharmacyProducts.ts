import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/axios';
import type { ProductItemData } from '../components/products/ProductCard';
import { FALLBACK_PRODUCTS } from '../data/mockProducts';

interface UsePharmacyProductsReturn {
  products: ProductItemData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePharmacyProducts = (): UsePharmacyProductsReturn => {
  const [products, setProducts] = useState<ProductItemData[]>(() =>
    FALLBACK_PRODUCTS.filter((p) => p.productType === 'PHARMACY' || !p.productType)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    apiClient
      .get<ProductItemData[]>('/products')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(
            FALLBACK_PRODUCTS.filter((p) => p.productType === 'PHARMACY' || !p.productType)
          );
        }
      })
      .catch(() => {
        // Gracefully use fallback pharmacy products
        setProducts(
          FALLBACK_PRODUCTS.filter((p) => p.productType === 'PHARMACY' || !p.productType)
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};
