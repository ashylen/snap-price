import { AppContext } from "app/appContext";
import { getProductsFromReceipt, normalizePrice } from "app/helpers";
import { useContext } from "react";
import { Text, View } from "react-native";

const Summary = () => {
  const { productImages, receiptImage } = useContext(AppContext);

  const receiptProducts = receiptImage && getProductsFromReceipt(receiptImage.decodedText);
  const receiptPiecesSum = receiptImage
    ? receiptProducts.pieces
        .map((product) =>
          parseFloat((normalizePrice(product.price) * normalizePrice(product.quantity)).toFixed(2))
        )
        .reduce((acc, currentValue) => acc + currentValue, 0)
    : 0;

  const receiptWeightsSum = receiptImage
    ? receiptProducts.pieces
        .map((product) =>
          parseFloat((normalizePrice(product.price) * normalizePrice(product.quantity)).toFixed(2))
        )
        .reduce((acc, currentValue) => acc + currentValue, 0)
    : 0;

  return (
    <View
      style={{
        backgroundColor: "#4169E1",
        height: 50,
        alignContent: "center",
        justifyContent: "center"
      }}>
      <Text
        style={{
          textAlign: "center"
        }}>
        Suma produktów:{" "}
        {productImages.map((item) => item.decodedText.price).reduce((acc, cost) => acc + cost, 0)}{" "}
        zł
      </Text>

      <Text
        style={{
          textAlign: "center"
        }}>
        Suma paragonu: {receiptPiecesSum + receiptWeightsSum} zł
      </Text>
    </View>
  );
};

export default Summary;
