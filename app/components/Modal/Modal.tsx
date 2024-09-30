import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";

interface CustomModalProps {
  visible: boolean;
  hideModal: () => void;
  imageUri: string | null;
  containerStyle?: object;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, hideModal, imageUri }) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          backgroundColor: "transparent",
          padding: 20
        }}
        dismissable
        dismissableBackButton>
        {imageUri && (
          <TouchableOpacity onPress={hideModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Zamknij</Text>
            </View>
            <Image source={{ uri: imageUri }} style={styles.modalImage} />
          </TouchableOpacity>
        )}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    backgroundColor: "black",
    padding: 10,
    paddingBottom: 4,
    justifyContent: "center",
    alignContent: "center"
  },
  modalHeaderText: {
    color: "#fff",
    marginLeft: "auto"
  },
  modalImage: {
    height: "100%",
    width: "100%",
    objectFit: "contain"
  }
});

export default CustomModal;
