import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { Image, TouchableOpacity } from "react-native";
import MlkitOcr, { MlkitOcrResult } from "react-native-mlkit-ocr";
import { DataTable, FAB, IconButton, MD3Colors, Modal, Portal, Text } from "react-native-paper";

import { AppContext } from "./appContext";

const Home = () => {
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const { productImages } = React.useContext(AppContext);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, productImages.length);

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

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const extractItemsFromDecodedText = (decodedText: MlkitOcrResult) => {
    const priceRegex = /^[^\s][0-9]+[\,|\.][0-9]+/gm;

    const convertedText: { itemName: string; price: string }[] = [];

    decodedText.forEach((item) => {
      console.log("decodedText", item.text);

      if (item.text.match(priceRegex)) {
        convertedText.push({
          itemName: decodedText[0].text,
          price: item.text.replaceAll(/[^0-9,.]/g, "")
        });
      }
    });

    console.log("HERE------------------------", convertedText);

    return convertedText;
  };

  const { setProductsImages } = React.useContext(AppContext);

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

      setProductsImages((prevState) => [...prevState, { path: imageUri, decodedText: resultsOcr }]);
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
      <DataTable style={{ backgroundColor: "#000000" }}>
        <DataTable.Header>
          <DataTable.Title>#</DataTable.Title>
          <DataTable.Title>Nazwa</DataTable.Title>
          <DataTable.Title>Cena</DataTable.Title>
          <DataTable.Title>Akcje</DataTable.Title>
        </DataTable.Header>

        {productImages.slice(from, to).map((item, index) => (
          <DataTable.Row key={item.path} style={{ height: 100 }}>
            <DataTable.Cell>{index}</DataTable.Cell>
            <DataTable.Cell>
              <Text>
                {extractItemsFromDecodedText(item.decodedText).map((product) => (
                  <Text key={product.itemName} style={{ color: "#ffffff" }}>
                    {product.itemName}
                  </Text>
                ))}
              </Text>
            </DataTable.Cell>

            <DataTable.Cell>
              <Text>
                {extractItemsFromDecodedText(item.decodedText).map((product) => (
                  <Text key={product.price} style={{ color: "#ffffff" }}>
                    {product.price}
                  </Text>
                ))}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
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

        {productImages.length > 2 && (
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(productImages.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${productImages.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel="Rows per page"
          />
        )}
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
