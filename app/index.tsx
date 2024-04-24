import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import MlkitOcr, { MlkitOcrResult } from "react-native-mlkit-ocr";
import { DataTable, FAB, IconButton, MD3Colors, Modal, Portal, Text } from "react-native-paper";

import { AppContext } from "./appContext";

const Home = () => {
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const { productImages, setProductsImages } = React.useContext(AppContext);

  const [visible, setVisible] = React.useState(false);

  const showModal = (imageUri) => {
    setModalContent(imageUri);
    setVisible(true);
  };
  const hideModal = () => setVisible(false);
  const [modalContent, setModalContent] = React.useState();
  const containerStyle = {
    backgroundColor: "transparent",
    padding: 20
  };

  const extractItemsFromDecodedText = (
    decodedText: MlkitOcrResult
  ): { fullText: string; itemName: string; price: number } => {
    console.log("HERE------------------------", decodedText);
    if (!decodedText) {
      return null;
    }

    const priceRegex = /^[^\s][0-9]+[,|.][0-9]+/gm;

    let convertedText: { fullText: string; itemName: string; price: number } = null;

    decodedText.forEach((item) => {
      if (item.text.match(priceRegex)) {
        convertedText = {
          fullText: decodedText.map((item) => item.text).join("|||"),
          itemName: decodedText[0].text,
          price: parseFloat(item.text.replaceAll(/[^0-9,.]/g, "").replaceAll(",", "."))
        };
      }
    });

    return convertedText;
  };

  const processResultImg = async (imgUri) => {
    await parseTextFromImage(imgUri);
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

  const parseTextFromImage = async (imageUri) => {
    try {
      const resultsOcr = await MlkitOcr.detectFromUri(imageUri);
      console.log("-----------resultsOcr", resultsOcr);
      const decodedText = extractItemsFromDecodedText(resultsOcr);

      setProductsImages((prevState) => [...prevState, { path: imageUri, decodedText }]);
    } catch (err) {
      console.error(err);
    }
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
          Suma:{" "}
          {productImages.map((item) => item.decodedText.price).reduce((acc, cost) => acc + cost, 0)}{" "}
          zł
        </Text>
      </View>
      <DataTable style={{ backgroundColor: "#000000" }}>
        <DataTable.Header>
          <DataTable.Title>Nazwa</DataTable.Title>
          <DataTable.Title numeric>Ilość</DataTable.Title>
          <DataTable.Title numeric>Cena</DataTable.Title>
          <DataTable.Title numeric>Akcje</DataTable.Title>
        </DataTable.Header>

        {productImages.map((item, index) => (
          <DataTable.Row key={item.path} style={{ height: 80 }}>
            <DataTable.Cell>
              <Text key={item.decodedText.fullText} style={{ color: "#ffffff" }}>
                {item.decodedText.itemName}
              </Text>
            </DataTable.Cell>

            <DataTable.Cell numeric>
              <Text key={item.decodedText.fullText} style={{ color: "#ffffff" }}>
                1
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text key={item.decodedText.fullText} style={{ color: "#ffffff" }}>
                {item.decodedText.price}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <IconButton
                icon="eye"
                iconColor={MD3Colors.neutral90}
                size={28}
                onPress={() => {
                  showModal(item.path);
                }}
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>

      <Portal>
        <FAB.Group
          open={open}
          visible
          variant="tertiary"
          fabStyle={{ marginBottom: 100 }}
          icon={open ? "close" : "plus"}
          actions={[
            {
              icon: "camera",
              label: "Zrób zdjęcie ceny produktu",
              onPress: () => openCamera()
            },
            {
              icon: "image",
              label: "Dodaj cenę produktu z Galerii",
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

export default Home;
