import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "app/context/appContext";
import { fetchGeminiReceipt } from "app/queries/gemini";
import { openCamera, openImagePicker } from "app/utils/camera";
import { compareProducts } from "app/utils/compare";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, DataTable, FAB, Portal, Snackbar, Text } from "react-native-paper";

import CustomModal from "../components/Modal/Modal";
import Summary from "../components/Summary";
import { THEME } from "../constants";

const Receipt = () => {
  const { receipt, setReceipt, products } = useAppContext();
  const [fabOpen, setFabOpen] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);

  const {
    mutateAsync,
    isPending,
    error: geminiError,
    reset,
    isError
  } = useMutation({ mutationFn: fetchGeminiReceipt });

  const mismatches = React.useMemo(
    () =>
      products?.length && receipt?.products?.length
        ? compareProducts(products, receipt.products)
        : [],
    [products, receipt?.products]
  );

  const mismatchedLabels = React.useMemo(
    () => new Set(mismatches.map((m) => m.label)),
    [mismatches]
  );

  const processImageResult = React.useCallback(
    async (result: ImagePicker.ImagePickerResult) => {
      await mutateAsync({ setReceipt, result });
    },
    [mutateAsync, setReceipt]
  );

  return (
    <>
      <CustomModal
        visible={previewVisible}
        hideModal={() => setPreviewVisible(false)}
        imageUri={receipt?.imageUri}
      />

      <Summary backgroundColor={THEME.receipt.backgroundColor} />

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Nazwa</DataTable.Title>
          <DataTable.Title numeric>Ilość</DataTable.Title>
          <DataTable.Title numeric>Cena</DataTable.Title>
          <DataTable.Title numeric>Wartość</DataTable.Title>
        </DataTable.Header>

        <ScrollView>
          {isPending && (
            <DataTable.Row key="loading-row" style={{ height: 80 }}>
              <DataTable.Cell>
                <View style={styles.loadingCell}>
                  <ActivityIndicator />
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          )}

          {receipt?.products?.map((product, index) => {
            const key = (product.label?.replace(" ", "") ?? "") + index;
            const isMismatch = mismatchedLabels.has(product.label);
            const mismatch = isMismatch ? mismatches.find((m) => m.label === product.label) : null;

            return (
              <DataTable.Row
                key={key}
                style={{ height: 70, backgroundColor: isMismatch ? "#ffe0e0" : "#fff" }}>
                <DataTable.Cell>
                  <Text numberOfLines={1} style={{ width: 150 }}>
                    {product.label}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text>{product.quantity}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={isMismatch ? styles.mismatchPrice : undefined}>
                    {product.price}
                    {isMismatch ? ` (${mismatch?.shelfPrice})` : ""}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text>{product.price * product.quantity}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </ScrollView>
      </DataTable>

      <Portal>
        <FAB.Group
          open={fabOpen}
          visible
          fabStyle={{ marginBottom: 100 }}
          icon={fabOpen ? "close" : "plus"}
          actions={[
            {
              icon: "camera",
              label: "Zrób zdjęcie paragonu",
              onPress: () => openCamera(processImageResult)
            },
            {
              icon: "image",
              label: "Dodaj paragon z Galerii",
              onPress: () => openImagePicker(processImageResult)
            },
            {
              icon: "eye",
              label: "Podejrzyj paragon",
              onPress: () => {
                if (receipt?.imageUri) setPreviewVisible(true);
              },
              containerStyle: !receipt?.imageUri && fabOpen ? { opacity: 0.2 } : {},
              style: !receipt?.imageUri && fabOpen ? { opacity: 0.2, pointerEvents: "none" } : {}
            }
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
        />
        <Snackbar style={styles.snackbar} visible={isError} onDismiss={reset} duration={5000}>
          {geminiError?.message}
        </Snackbar>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  loadingCell: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  mismatchPrice: { color: "#cc0000", fontWeight: "bold" },
  snackbar: { position: "absolute", bottom: 50, flex: 1, justifyContent: "flex-end" }
});

export default Receipt;
