import { FlashList } from "@shopify/flash-list";
import { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { AppContext } from "./appContext";

const Photos = () => {
  const { images } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <FlashList
        data={images}
        renderItem={({ item, index: rowIndex }) => (
          <View
            style={{
              ...styles.row,
              backgroundColor: rowIndex % 2 ? "#d1d1d1" : "#ffffff",
            }}
          >
            <Text>#{rowIndex}</Text>
            <Image
              source={{ uri: item.path }}
              style={{ height: 50, width: 50 }}
            />
            <Text style={styles.rowDescription}>
              {item.decodedText.map((textGroup, index) => (
                <Text key={textGroup.text.replace(" ", "") + index}>
                  {textGroup.text}
                </Text>
              ))}
            </Text>
          </View>
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: "100%", fontFamily: "WorkSans-Regular" },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  rowDescription: { height: "auto" },
  imageContainer: {},
  buttonContainer: {},
  button: { padding: 20, backgroundColor: "#00a2ed", margin: 10 },
  buttonText: { color: "#ffffff" },
});

export default Photos;
