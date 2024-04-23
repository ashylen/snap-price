import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import MlkitOcr, { MlkitOcrResult } from "react-native-mlkit-ocr";
import { DataTable, FAB, Modal, Portal, Text } from "react-native-paper";

import { AppContext } from "./appContext";

const Receipt = () => {
  const { receiptImage, setReceiptImage } = React.useContext(AppContext);
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const [visible, setVisible] = React.useState(false);

  const hideModal = () => setVisible(false);
  const [modalContent, setModalContent] = React.useState();
  const containerStyle = {
    backgroundColor: "transparent",
    padding: 20
  };

  const processResultImg = async (imgUri) => {
    await mlOCR(imgUri);
  };

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("No Gallery Access!");
      return;
    }
    //Allow editing after taking the image from gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    // Explore the result

    if (!result.canceled) {
      await processResultImg(result.assets[0].uri);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("No Camera Access!");
      return;
    }

    //Allow editing after taking the picture
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

      // item.text
    });

    console.log("HERE------------------------", convertedText);

    return convertedText;
  };

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          dismissable
          dismissableBackButton>
          {modalContent && (
            <TouchableOpacity onPress={hideModal}>
              <Image
                source={{ uri: modalContent }}
                style={{ height: "100%", width: "100%", objectFit: "contain" }}
              />
            </TouchableOpacity>
          )}
        </Modal>
      </Portal>
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
