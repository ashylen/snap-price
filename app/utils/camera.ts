import * as ImagePicker from "expo-image-picker";

export const requestPermission = async (
  requestFunction: () => Promise<{ granted: boolean }>,
  permissionMessage: string
) => {
  const permissionResult = await requestFunction();
  if (!permissionResult.granted) {
    alert(permissionMessage);
    return false;
  }
  return true;
};

export const openCamera = async (processImage: (result: ImagePicker.ImagePickerResult) => void) => {
  const hasPermission = await requestPermission(
    ImagePicker.requestCameraPermissionsAsync,
    "Brak dostępu do aparatu. Nadaj dostęp do aparatu dla tej aplikacji w ustawieniach telefonu."
  );

  if (!hasPermission) return;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 0.8,
    base64: true
  });

  if (!result.canceled) {
    processImage(result);
  }
};

export const openImagePicker = async (
  processImage: (result: ImagePicker.ImagePickerResult) => void
) => {
  const hasPermission = await requestPermission(
    ImagePicker.requestCameraPermissionsAsync,
    "Brak dostępu do galerii zdjęć. Nadaj dostęp do galerii zdjęć dla tej aplikacji w ustawieniach telefonu."
  );

  if (!hasPermission) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 0.8,
    base64: true
  });

  if (!result.canceled) {
    processImage(result);
  }
};
