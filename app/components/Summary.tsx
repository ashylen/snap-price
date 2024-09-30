import { AppContext } from "app/context/appContext";
import React, { useContext } from "react";
import { Text, View } from "react-native";

const Summary = () => {
  const { products, receipt } = useContext(AppContext);

  console.log(receipt);

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
        Suma produktów:
        {products
          .map((item) => item.product.price)
          .reduce((acc, cost) => acc + Number(cost), 0) // TODO: fix this number conversion NaN
          .toFixed(2)}
        zł
      </Text>

      <Text
        style={{
          textAlign: "center"
        }}>
        Suma paragonu:
        {receipt?.products
          .map((item) => item.price)
          .reduce((acc, cost) => acc + Number(cost), 0)
          .toFixed(2) || 0}
        zł
      </Text>
    </View>
  );
};

export default Summary;
