import { AppContext, Product } from "app/context/appContext";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";

interface EditProductModalProps {
  modalProduct: Product | null;
  setModalProduct: (product: Product | null) => void;
}

const EditProductModal = ({ modalProduct, setModalProduct }: EditProductModalProps) => {
  const [quantity, setQuantity] = useState(modalProduct?.product?.quantity?.toString() ?? "1");

  useEffect(() => {
    setQuantity(modalProduct?.product?.quantity?.toString() ?? "1");
  }, [modalProduct]);

  const { setProducts } = useContext(AppContext);

  const handleCloseModal = () => setModalProduct(null);

  const handleSubmit = () => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.key !== modalProduct?.key) return product;
        return {
          ...product,
          product: { ...product.product, quantity: parseInt(quantity, 10) || 1 }
        };
      })
    );
    handleCloseModal();
  };

  return (
    <Portal>
      <Modal
        visible={!!modalProduct}
        onDismiss={handleCloseModal}
        contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>{modalProduct?.product?.label}</Text>
        <TextInput
          style={styles.input}
          placeholder="Ilość"
          value={quantity}
          keyboardType="numeric"
          onChangeText={setQuantity}
        />
        <Button mode="contained" onPress={handleSubmit}>
          Zapisz
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10
  },
  modalTitle: { fontSize: 20, marginBottom: 20 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10
  }
});

export default EditProductModal;
