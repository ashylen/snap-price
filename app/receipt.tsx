import { useMutation } from "@tanstack/react-query";
import { openCamera, openImagePicker } from "app/utils/camera";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, DataTable, FAB, Portal, Snackbar, Text } from "react-native-paper";

import CustomModal from "./components/Modal/Modal";
import Summary from "./components/Summary";
import { AppContext } from "./context/appContext";
import { fetchGeminiReceipt } from "./queries/gemini";
import { compareProducts } from "./utils/compare";
import { THEME } from "./constants";

const Receipt = () => {
  const { receipt, setReceipt, products } = React.useContext(AppContext);

  const mismatches =
    products?.length && receipt?.products?.length
      ? compareProducts(products, receipt.products)
      : [];
  const mismatchedLabels = new Set(mismatches.map((m) => m.label));
  const [state, setState] = React.useState({ open: false });
  const [visible, setVisible] = React.useState(false);
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const hideModal = () => setVisible(false);

  const {
    mutateAsync,
    isPending,
    error: geminiError,
    reset,
    isError
  } = useMutation({
    mutationFn: fetchGeminiReceipt
  });

  const processImageResult = async (result: ImagePicker.ImagePickerResult) => {
    await mutateAsync({ setReceipt, result });
  };

  return (
    <>
      <CustomModal visible={visible} hideModal={hideModal} imageUri={receipt?.imageUri} />

      <Summary backgroundColor={THEME.receipt.backgroundColor} />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>#</DataTable.Title>
          <DataTable.Title>Nazwa</DataTable.Title>
          <DataTable.Title>Ilość</DataTable.Title>
          <DataTable.Title>Cena</DataTable.Title>
          <DataTable.Title>Wartość</DataTable.Title>
        </DataTable.Header>

        <ScrollView>
          {isPending && (
            <DataTable.Row key="loading-row" style={{ height: 80 }}>
              <DataTable.Cell>
                <View style={styles.loadingCell}>
                  <View>
                    <ActivityIndicator />
                  </View>
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          )}

          {receipt?.products?.map((product, index) => {
            const key = product.label?.replace(" ", "") + index;
            const isMismatch = mismatchedLabels.has(product.label);
            const mismatch = isMismatch ? mismatches.find((m) => m.label === product.label) : null;

            return (
              <DataTable.Row key={key} style={{ height: 70, backgroundColor: isMismatch ? "#ffe0e0" : "#fff" }}>
                <DataTable.Cell>
                  <Text numberOfLines={1} key={key} style={{ width: 150 }}>
                    {product.label}
                  </Text>
                </DataTable.Cell>

                <DataTable.Cell numeric>
                  <Text key={key}>{product.quantity}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text key={key} style={isMismatch ? { color: "#cc0000", fontWeight: "bold" } : {}}>
                    {product.price}{isMismatch ? ` (${mismatch.shelfPrice})` : ""}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text key={key}>{product.price * product.quantity}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </ScrollView>
      </DataTable>

      <Portal>
        <FAB.Group
          open={open}
          visible
          fabStyle={{ marginBottom: 100 }}
          icon={open ? "close" : "plus"}
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
                if (receipt?.imageUri) {
                  setVisible(true);
                }
              },
              containerStyle: !receipt?.imageUri && open ? { opacity: 0.2 } : {},
              style: !receipt?.imageUri && open ? { opacity: 0.2, pointerEvents: "none" } : {}
            }
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "100%"
  },
  snackbar: {
    flex: 1,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 50
  }
});

export default Receipt;
