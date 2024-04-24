import { createContext, useState } from "react";
import { MlkitOcrResult } from "react-native-mlkit-ocr";

export const AppContext = createContext<{
  productImages: {
    path: string;
    decodedText: { fullText: string; itemName: string; price: number };
  }[];
  setProductsImages: Function;
  receiptImage: { path: string; decodedText: MlkitOcrResult };
  setReceiptImage: Function;
}>(null);

export const ContextProvider = (props) => {
  const [productImages, setProductsImages] = useState([]);
  const [receiptImage, setReceiptImage] = useState(null);

  return (
    <AppContext.Provider
      value={{
        productImages,
        setProductsImages,
        receiptImage,
        setReceiptImage
      }}>
      {props.children}
    </AppContext.Provider>
  );
};
