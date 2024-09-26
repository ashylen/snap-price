import { useMutation } from "@tanstack/react-query";
import { AppContext, Product } from "app/context/appContext";
import { fetchGeminiAnswer } from "app/queries/gemini";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  DataTable,
  FAB,
  IconButton,
  MD3Colors,
  Modal,
  Portal,
  Snackbar,
  Text
} from "react-native-paper";
import { RowMap, SwipeListView } from "react-native-swipe-list-view";

import Summary from "./Summary";
import { ListRenderItemInfo } from "@shopify/flash-list";
const Home = () => {
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const { products, setProducts } = React.useContext(AppContext);
  const {
    mutateAsync,
    isPending,

    isError,
    error: geminiError,
    reset
  } = useMutation({
    mutationFn: fetchGeminiAnswer
  });

  console.log("error", geminiError);

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

  const showImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(
        "Brak uprawnień do aparatu. Nadaj dostęp do apartu dla tej aplikacji w ustawieniach telefonu."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true
    });

    await mutateAsync({ setProducts, result });
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("No Camera Access!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true
    });

    await mutateAsync({ setProducts, result });
  };

  const closeRow = (rowMap: RowMap<Product>, rowKey: keyof RowMap<Product>) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: RowMap<Product>, rowKey: keyof RowMap<Product>) => {
    closeRow(rowMap, rowKey);
    const newData = [...products];
    const prevIndex = products.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setProducts(newData);
  };

  const renderHiddenItem = (data: ListRenderItemInfo<Product>, rowMap: RowMap<Product>) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, data.item.key)}>
        <Text style={styles.backTextWhite}>Edytuj</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key)}>
        <Text style={styles.backTextWhite}>Usuń</Text>
      </TouchableOpacity>
    </View>
  );

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
              <View
                style={{
                  backgroundColor: "black",
                  padding: 10,
                  paddingBottom: 4,
                  justifyContent: "center",
                  alignContent: "center"
                }}>
                <Text style={{ color: "#fff", marginLeft: "auto" }}>Zamknij</Text>
              </View>
              <Image
                source={{ uri: modalContent }}
                style={{ height: "100%", width: "100%", objectFit: "contain" }}
              />
            </TouchableOpacity>
          )}
        </Modal>
      </Portal>
      <Summary />
      <DataTable style={{ backgroundColor: "#fff" }}>
        <DataTable.Header>
          <DataTable.Title>Nazwa</DataTable.Title>
          <DataTable.Title numeric>Ilość</DataTable.Title>
          <DataTable.Title numeric>Cena</DataTable.Title>
          <DataTable.Title numeric>Podgląd</DataTable.Title>
        </DataTable.Header>

        <SwipeListView
          data={products}
          renderItem={(data, rowMap) => (
            <DataTable.Row key={data.item.imageUri} style={{ height: 80, backgroundColor: "#fff" }}>
              <DataTable.Cell>
                <Text key={data.item.imageUri}>{data.item.answer.label}</Text>
              </DataTable.Cell>

              <DataTable.Cell numeric>
                <Text key={data.item.imageUri}>1</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text key={data.item.imageUri}>{data.item.answer.price}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <IconButton
                  icon="eye"
                  iconColor={MD3Colors.neutral90}
                  size={28}
                  onPress={() => {
                    showModal(data.item.imageUri);
                  }}
                />
              </DataTable.Cell>
            </DataTable.Row>
          )}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={0}
          rightOpenValue={-150}
        />

        {isPending && (
          <DataTable.Row key="loading-row" style={{ height: 80 }}>
            <DataTable.Cell>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: "100%"
                }}>
                <View>
                  <ActivityIndicator />
                </View>
              </View>
            </DataTable.Cell>
          </DataTable.Row>
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
        />

        <Snackbar
          style={{
            flex: 1,
            justifyContent: "flex-end",
            position: "absolute",
            bottom: 50
          }}
          visible={isError}
          onDismiss={reset}
          duration={5000}>
          {geminiError?.message}
        </Snackbar>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  backTextWhite: {
    color: "#FFF"
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0
  }
});

export default Home;
