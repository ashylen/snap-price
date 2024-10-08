import { useMutation } from "@tanstack/react-query";
import { AppContext, Product } from "app/context/appContext";
import { fetchGeminiProduct } from "app/queries/gemini";
import { openCamera, openImagePicker } from "app/utils/camera";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { ListRenderItemInfo, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  DataTable,
  FAB,
  IconButton,
  MD3Colors,
  Portal,
  Snackbar,
  Text
} from "react-native-paper";
import { RowMap, SwipeListView } from "react-native-swipe-list-view";

import CustomModal from "./components/Modal/Modal";
import Summary from "./components/Summary";
import { THEME } from "./constants";

const Home = () => {
  const [state, setState] = React.useState({ open: false });
  const [modalImageUri, setModalImageUri] = React.useState("");
  const { products, setProducts } = React.useContext(AppContext);
  const {
    mutateAsync,
    isPending,
    isError,
    error: geminiError,
    reset
  } = useMutation({
    mutationFn: fetchGeminiProduct
  });

  const [visible, setVisible] = React.useState(false);
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const showModal = (rowMap: RowMap<Product>, productKey: string) => {
    const selectedProduct = products?.find((product) => product.key === productKey);
    setModalImageUri(selectedProduct.imageUri);
    closeRow(rowMap, selectedProduct.key);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const closeRow = (rowMap: RowMap<Product>, rowKey: keyof RowMap<Product>) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: RowMap<Product>, rowKey: keyof RowMap<Product>) => {
    closeRow(rowMap, rowKey);
    const newData = [...products];
    const prevIndex = products?.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setProducts(newData);
  };

  const renderHiddenItem = (data: ListRenderItemInfo<Product>, rowMap: RowMap<Product>) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtn]}
        onPress={() => {
          showModal(rowMap, data.item.key);
        }}>
        <IconButton icon="eye" iconColor={MD3Colors.error100} size={28} />
      </TouchableOpacity>
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

  const processImage = async (result: ImagePicker.ImagePickerResult) => {
    await mutateAsync({ setProducts, result });
  };

  const floatingBtnActions = [
    {
      icon: "camera",
      label: "Zrób zdjęcie ceny produktu",
      onPress: () => openCamera(processImage)
    },
    {
      icon: "image",
      label: "Dodaj cenę produktu z Galerii",
      onPress: () => openImagePicker(processImage)
    }
  ];

  return (
    <>
      <CustomModal visible={visible} hideModal={hideModal} imageUri={modalImageUri} />
      <Summary backgroundColor={THEME.shoppingList.backgroundColor} />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Nazwa</DataTable.Title>
          <DataTable.Title numeric>Ilość</DataTable.Title>
          <DataTable.Title numeric>Cena</DataTable.Title>
        </DataTable.Header>

        <SwipeListView
          scrollEnabled
          data={products}
          renderItem={(data) => (
            <DataTable.Row key={data.item.imageUri} style={{ height: 70, backgroundColor: "#fff" }}>
              <DataTable.Cell>
                <Text numberOfLines={1} key={data.item.imageUri} style={{ width: 150 }}>
                  {data.item.product.label}
                </Text>
              </DataTable.Cell>

              <DataTable.Cell numeric>
                <Text key={data.item.imageUri}>1</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text key={data.item.imageUri}>{data.item.product.price}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          )}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={70}
          rightOpenValue={-150}
        />

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
      </DataTable>

      <Portal>
        <FAB.Group
          open={open}
          visible
          variant="tertiary"
          fabStyle={styles.fabGroup}
          icon={open ? "close" : "plus"}
          actions={floatingBtnActions}
          onStateChange={onStateChange}
        />

        <Snackbar style={styles.snackbar} visible={isError} onDismiss={reset} duration={5000}>
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
  },

  fabGroup: {
    marginBottom: 100,
    backgroundColor: THEME.shoppingList.backgroundColor
  },
  snackbar: {
    flex: 1,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 50
  },
  loadingCell: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "100%"
  }
});

export default Home;
