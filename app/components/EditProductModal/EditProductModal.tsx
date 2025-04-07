import { AppContext, Product } from "app/context/appContext";
import React, { useContext, useState } from "react";
import { Button, TextInput, StyleSheet } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";

interface EditProductModalProps {
  modalProduct: Product;
  setModalProduct: (product: Product) => void;
}

const EditProductModal = ({ modalProduct, setModalProduct }: EditProductModalProps) => {
  const [formData, setFormData] = useState({
    quantity: modalProduct?.product?.quantity || "1"
  });

  const { setProducts } = useContext(AppContext);

  const handleCloseModal = () => {
    setModalProduct(null);
  };

  const handleInputChange = (label: string, value: string) => {
    setFormData({ ...formData, [label]: value });
  };

  const handleSubmit = () => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.key === modalProduct.key) {
          return {
            ...product,
            product: {
              ...product.product,
              quantity: parseInt(formData.quantity.toString(), 10)
            }
          };
        }
        return product;
      });
    });

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
          placeholder="quantity"
          value={formData.quantity?.toString()}
          onChangeText={(text) => handleInputChange("quantity", text)}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
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
  modalTitle: {
    fontSize: 20,
    marginBottom: 20
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10
  }
});

export default EditProductModal;
