import { AppContext } from "app/context/appContext";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

const Summary = () => {
  const { products, receipt } = useContext(AppContext);

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0).toFixed(2);
  };

  const calculateProductTotal = (products) => {
    return products
      .map((item) => Number(item.product.price).toFixed(2))
      .reduce((acc, cost) => acc + Number(cost), 0)
      .toFixed(2);
  };

  const receiptTotal = receipt?.products ? calculateTotal(receipt.products) : "0.00";
  const productTotal = products ? calculateProductTotal(products) : "0.00";
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Suma produktów: {productTotal} zł</Text>
      <Text style={styles.text}>Suma paragonu: {receiptTotal} zł</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4169E1",
    height: 60,
    alignContent: "center",
    justifyContent: "center"
  },
  text: {
    textAlign: "center"
  }
});

export default Summary;
