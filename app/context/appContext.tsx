import React, { createContext, useState } from "react";
import { MlkitOcrResult } from "react-native-mlkit-ocr";

export type AIAnswerFormat = { label: string; price: string };
export type Product = { imageUri: string; answer: AIAnswerFormat; quantity: number; key: string };

export const AppContext = createContext<{
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  receiptImage: { path: string; decodedText: MlkitOcrResult };
  setReceiptImage: Function;
}>(null);

export const ContextProvider = (props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [receiptImage, setReceiptImage] = useState(null);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        receiptImage,
        setReceiptImage
      }}>
      {props.children}
    </AppContext.Provider>
  );
};
