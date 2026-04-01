import React, { createContext, useContext, useState } from "react";

export type ProductFormat = { label: string; price: number; weight?: string; quantity: number };
export type Product = { imageUri: string; product: ProductFormat; key: string };
export type Receipt = { imageUri: string; products: ProductFormat[]; key: string };

type AppContextValue = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  receipt: Receipt | null;
  setReceipt: React.Dispatch<React.SetStateAction<Receipt | null>>;
};

export const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within ContextProvider");
  return ctx;
};

export const ContextProvider = ({ children }: React.PropsWithChildren) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  return (
    <AppContext.Provider value={{ products, setProducts, receipt, setReceipt }}>
      {children}
    </AppContext.Provider>
  );
};
