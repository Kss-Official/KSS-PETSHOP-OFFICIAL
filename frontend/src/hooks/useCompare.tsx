import React, { createContext, useContext, useState } from 'react';
import type { ProductItemData } from '../components/products/ProductCard';

interface CompareContextType {
  compareList: ProductItemData[];
  addToCompare: (product: ProductItemData) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;
  isCompareSheetOpen: boolean;
  openCompareSheet: () => void;
  closeCompareSheet: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<ProductItemData[]>([]);
  const [isCompareSheetOpen, setIsCompareSheetOpen] = useState(false);

  const addToCompare = (product: ProductItemData) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      if (prev.length >= 4) {
        // limit to 4 items max
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: number) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareSheetOpen(false);
  };

  const isInCompare = (productId: number) => {
    return compareList.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareSheetOpen,
        openCompareSheet: () => setIsCompareSheetOpen(true),
        closeCompareSheet: () => setIsCompareSheetOpen(false),
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
