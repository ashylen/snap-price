import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { MB } from "app/constants";
import { AIAnswerFormat, Product } from "app/context/appContext";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_API_AI_KEY);

const runGemini = async (
  prompt = "What's difference between these pictures?",
  imageParts: (string | Part)[]
) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });
  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;

    const text = response.text();
    return text;
  } catch (error: unknown) {
    return { error: true, message: (error as { message: string }).message };
  }
};

export const fetchGeminiAnswer = async ({
  setProducts,
  result
}: {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  result: ImagePicker.ImagePickerResult;
}): Promise<void> => {
  if (!result.canceled) {
    // @ts-expect-error ImagePickerResult returns `filesize` instead of `fileSize` - wrong types.
    const { base64: image, filesize, mimeType } = result.assets[0];

    console.log(result.assets[0]);

    if (filesize >= 4 * MB) {
      throw new Error("Przesyłane zdjęcie jest za duże. Maksymalny rozmiar zdjęcia to 4MB");
    }

    const payload: (string | Part)[] = [
      {
        inlineData: { mimeType, data: image }
      }
    ];

    const response = await runGemini(
      "Extract product label and price without currency from this image and return it with JSON format (with keys 'label' and 'price'). If no price was found, ignore previous command and return trimmed 'null' value instead of object.",
      payload
    );

    // check if there was an error processing image
    if (typeof response !== "string" && response?.error) {
      throw new Error(`Coś poszło nie tak, spróbuj ponownie.`);
    }

    console.log("response", response.toString());
    console.log(typeof response.toString());

    console.log("t111hrow");
    if (response.toString().trim() === "null") {
      console.log("throw");
      throw new Error(`Nie znaleziono produktu na zdjęciu, spróbuj ponownie.`);
    }

    // @ts-expect-error fix
    if (response?.includes("{")) {
      const answer = JSON.parse(response as string) as AIAnswerFormat;

      if (answer?.label?.trim() === "null" || answer?.label === null) {
        // In case of Gemini returning answer in wrong format.
        throw new Error(`Nie znaleziono produktu na przesłanym zdjęciu, spróbuj ponownie.`);
      }

      setProducts((prevState) => [
        ...prevState,
        {
          imageUri: result.assets[0].uri,
          answer,
          quantity: 1,
          key: Crypto.randomUUID()
        }
      ]);
    }
  }
};
