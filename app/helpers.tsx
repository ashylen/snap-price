import { MlkitOcrResult } from "react-native-mlkit-ocr";

type ReceiptProduct = {
  fullString: string;
  itemName: string;
  quantity: string;
  price: number;
};

export const getProductsFromReceipt = (
  decodedText: MlkitOcrResult
): {
  pieces: ReceiptProduct[];
  weights: ReceiptProduct[];
} => {
  const convertedText: {
    pieces: ReceiptProduct[];
    weights: ReceiptProduct[];
  } = { pieces: [], weights: [] };

  const receiptRegexPieces = /^(.+)([0-9]+\sszt[^0-9]?)([0-9.|,]+)$/gm;
  const receiptRegexWieghts = /^(.+)([0-9]+\.[0-9]+)(\skg[^0-9]?)([0-9.|,]+)$/gm;

  decodedText.forEach((item) => {
    const matchesPieces = item.text.matchAll(receiptRegexPieces);

    for (const matchedGroup of matchesPieces) {
      const [
        fullString, //[0] -> matched string "1 Blue gatorade $2.00"
        itemName, //[1] -> quantity "1"
        quantity, //[2] -> item description "Blue gatorade"
        price //[3] -> "$" (should probably always ignore)
      ] = matchedGroup;

      convertedText.pieces.push({
        fullString,
        itemName,
        quantity: quantity.replaceAll(/[^0-9]/g, ""),
        price: normalizePrice(price)
      });
    }

    const matchesWeights = item.text.matchAll(receiptRegexWieghts);

    for (const matchedGroup of matchesWeights) {
      const [
        fullString, //[0] -> matched string "1 Blue gatorade $2.00"
        itemName, //[1] -> quantity "1"
        quantity, //[2] -> item description "Blue gatorade"
        ,
        price //[4] -> "$" (should probably always ignore)
      ] = matchedGroup;

      convertedText.weights.push({
        fullString,
        itemName,
        quantity,
        price: normalizePrice(price)
      });
    }
  });

  console.log("HERE------------------------", convertedText);

  return convertedText;
};

export const normalizePrice = (price: string | number) => {
  if (typeof price === "number") {
    return price;
  }

  const parsedPrice = parseFloat(price.replaceAll(/[^0-9,.]/g, "").replaceAll(",", "."));

  if (isNaN(parsedPrice)) {
    console.warn(`${price} is not a number!`);
  }

  return parsedPrice;
};
