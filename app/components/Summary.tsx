import { AppContext } from "app/context/appContext";
import { getProductsFromReceipt, normalizePrice } from "app/helpers";
import React, { useContext } from "react";
import { Text, View } from "react-native";

const Summary = () => {
  const { products, receiptImage } = useContext(AppContext);

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
        {products
          .map((item) => item.answer.price)
          .reduce((acc, cost) => {
            console.log("cost", cost);
            const fixedPrice = cost?.replace(",", ".");
            return acc + Number(fixedPrice);
          }, 0)}{" "}
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
