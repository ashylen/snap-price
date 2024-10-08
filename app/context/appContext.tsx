import React, { createContext, useState } from "react";

export type ProductFormat = { label: string; price: number; weight?: string; quantity: number };
export type Product = { imageUri: string; product: ProductFormat; quantity: number; key: string };
export type Receipt = { imageUri: string; products: ProductFormat[]; key: string };

export const AppContext = createContext<{
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  receipt: Receipt;
  setReceipt: React.Dispatch<React.SetStateAction<Receipt>>;
}>(null);

export const ContextProvider = (props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [receipt, setReceipt] = useState<Receipt>(null);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        receipt,
        setReceipt
      }}>
      {props.children}
    </AppContext.Provider>
  );
};
