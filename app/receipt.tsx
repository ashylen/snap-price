import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { ScrollView } from "react-native";
import MlkitOcr from "react-native-mlkit-ocr";
import { DataTable, FAB, Portal, Text } from "react-native-paper";

import { AppContext } from "./appContext";
import Summary from "./components/Summary";
import { getProductsFromReceipt, normalizePrice } from "./helpers";

const Receipt = () => {
  const { receiptImage, setReceiptImage } = React.useContext(AppContext);
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const processResultImg = async (imgUri) => {
    await mlOCR(imgUri);
  };

  const showImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("No Gallery Access!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      await processResultImg(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("No Camera Access!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      await processResultImg(result.assets[0].uri);
    }
  };

  const mlOCR = async (imageUri) => {
    try {
      const resultsOcr = await MlkitOcr.detectFromUri(imageUri);

      console.log(
        "xddd-------------------------",
        resultsOcr.map((item) => item.text)
      );
      setReceiptImage({ path: imageUri, decodedText: resultsOcr });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Summary />
      <DataTable style={{ backgroundColor: "#000000" }}>
        <DataTable.Header>
          <DataTable.Title>#</DataTable.Title>
          <DataTable.Title>Nazwa</DataTable.Title>
          <DataTable.Title>Ilość</DataTable.Title>
          <DataTable.Title>Cena</DataTable.Title>
          <DataTable.Title>Wartość</DataTable.Title>
        </DataTable.Header>

        <ScrollView>
          {receiptImage?.decodedText &&
            getProductsFromReceipt(receiptImage.decodedText).pieces.map((product, index) => (
              <DataTable.Row key={product.itemName + index}>
                <DataTable.Cell>{index}</DataTable.Cell>

                <DataTable.Cell>
                  <Text>{product.itemName}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{product.quantity} szt</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{product.price}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{product.price * normalizePrice(product.quantity)}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

          {receiptImage?.decodedText &&
            getProductsFromReceipt(receiptImage.decodedText).weights.map((product, index) => (
              <DataTable.Row key={product.itemName + index}>
                <DataTable.Cell>{index}</DataTable.Cell>

                <DataTable.Cell>
                  <Text>{product.itemName}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{product.quantity} kg</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{product.price}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{(product.price * normalizePrice(product.quantity)).toFixed(2)}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
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
              onPress: () => openCamera()
            },
            {
              icon: "image",
              label: "Dodaj paragon z Galerii",
              onPress: () => showImagePicker()
            }
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </>
  );
};

export default Receipt;
