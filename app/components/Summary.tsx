import { useAppContext } from "app/context/appContext";
import { compareProducts } from "app/utils/compare";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

const Summary = ({ backgroundColor }: { backgroundColor: string }) => {
  const { products, receipt } = useAppContext();

  const productTotal = useMemo(
    () =>
      products
        .reduce((acc, item) => acc + Number(item.product.price) * item.product.quantity, 0)
        .toFixed(2),
    [products]
  );

  const receiptTotal = useMemo(
    () =>
      receipt?.products
        ? receipt.products
            .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
            .toFixed(2)
        : "0.00",
    [receipt?.products]
  );

  const mismatches = useMemo(
    () =>
      products?.length && receipt?.products?.length
        ? compareProducts(products, receipt.products)
        : [],
    [products, receipt?.products]
  );

  const totalOvercharge = useMemo(
    () => mismatches.reduce((acc, m) => acc + m.overcharge, 0),
    [mismatches]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        mismatches.length > 0 && styles.containerTall
      ]}>
      <Text style={styles.text}>Suma produktów: {productTotal} zł</Text>
      <Text style={styles.text}>Suma paragonu: {receiptTotal} zł</Text>
      {mismatches.length > 0 && (
        <Text style={styles.overcharge}>
          ⚠ {mismatches.length} zawyżon{mismatches.length === 1 ? "a" : "e"} cen
          {mismatches.length === 1 ? "a" : "y"}: +{totalOvercharge.toFixed(2)} zł
        </Text>
      )}
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
  containerTall: { height: 90 },
  text: { textAlign: "center" },
  overcharge: { textAlign: "center", color: "#ff4444", fontWeight: "bold", fontSize: 13 }
});

export default Summary;
