import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { ScrollView } from "react-native";
import MlkitOcr, { MlkitOcrResult } from "react-native-mlkit-ocr";
import { DataTable, FAB, Portal, Text } from "react-native-paper";

import { AppContext } from "./appContext";

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

      setReceiptImage({ path: imageUri, decodedText: resultsOcr });
    } catch (err) {
      console.error(err);
    }
  };

  const extractItemsFromDecodedText = (decodedText: MlkitOcrResult) => {
    const receiptRegexPieces = /^(.+)([0-9]+\sszt[^0-9]?)([0-9.|,]+)$/gm;

    const convertedText: {
      fullString: string;
      itemName: string;
      quantity: string;
      price: string;
    }[] = [];

    decodedText.forEach((item) => {
      const matches = item.text.matchAll(receiptRegexPieces);

      console.log(matches);
      for (const matchedGroup of matches) {
        const [
          fullString, //[0] -> matched string "1 Blue gatorade $2.00"
          itemName, //[1] -> quantity "1"
          quantity, //[2] -> item description "Blue gatorade"
          price //[3] -> "$" (should probably always ignore)
        ] = matchedGroup;

        convertedText.push({
          fullString,
          itemName,
          quantity: quantity.replaceAll(/[^0-9]/g, ""),
          price
        });
      }
    });

    console.log("HERE------------------------", convertedText);

    return convertedText;
  };

  return (
    <>
      <DataTable style={{ backgroundColor: "#000000" }}>
        <DataTable.Header>
          <DataTable.Title>#</DataTable.Title>
          <DataTable.Title>Nazwa</DataTable.Title>
          <DataTable.Title>Ilość</DataTable.Title>
          <DataTable.Title>Cena</DataTable.Title>
        </DataTable.Header>

        <ScrollView>
          {receiptImage?.decodedText &&
            extractItemsFromDecodedText(receiptImage.decodedText).map((product, index) => (
              <DataTable.Row key={product.itemName + index}>
                <DataTable.Cell>{index}</DataTable.Cell>

                <DataTable.Cell>
                  <Text>{product.itemName}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{product.quantity}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{product.price}</Text>
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
