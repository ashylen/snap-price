import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MlkitOcr from "react-native-mlkit-ocr";

import { AppContext } from "./appContext";

const DATA = [
  {
    title: "First Item",
  },
  {
    title: "Second Item",
  },
];

const Home = () => {
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [uriValue, setUriValue] = useState(null);
  const [resultsFromOcr, setResultsFromOcr] = useState(null);
  const { images, setImages } = useContext(AppContext);

  console.log(images);
  const processResultImg = async (imgUri) => {
    setPickedImagePath(imgUri);
    setUriValue(imgUri);
    await mlOCR(imgUri);
  };

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("No Gallery Access!");
      return;
    }
    //Allow editing after taking the image from gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // Explore the result
    // console.log(result);

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
      quality: 1,
    });

    if (!result.canceled) {
      await processResultImg(result.assets[0].uri);
    }
  };

  const mlOCR = async (imageUri) => {
    try {
      const resultsOcr = await MlkitOcr.detectFromUri(imageUri);
      console.log(resultsOcr);

      setResultsFromOcr(resultsOcr);
      setImages((prevState) => [
        ...prevState,
        { path: imageUri, decodedText: resultsOcr },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "black",
          fontSize: 20,
          marginTop: 50,
          marginBottom: 50,
          textAlign: "center",
        }}
      >
        Zeskanuj cenówkę
      </Text>
      <View style={styles.imageContainer}>
        {pickedImagePath !== "" && (
          <Image
            source={{ uri: pickedImagePath }}
            style={styles.previewImage}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={showImagePicker}>
          <Text style={styles.buttonText}>Wybierz z galerii</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Text style={styles.buttonText}>Otwórz kamerę</Text>
        </TouchableOpacity>
      </View>

      {uriValue && (
        <Image
          source={{ uri: uriValue }}
          contentFit="contain"
          transition={1000}
          style={{ width: 200, height: 200, objectFit: "contain" }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: "100%" },
  imageContainer: {},
  buttonContainer: {},
  button: { padding: 20, backgroundColor: "#00a2ed", margin: 10 },
  buttonText: { color: "#ffffff" },
});

export default Home;
