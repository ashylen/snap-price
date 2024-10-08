import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { MB } from "app/constants";
import { Product, ProductFormat, Receipt } from "app/context/appContext";
import { normalizePrice } from "app/helpers";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_API_AI_KEY);

const MAX_FILE_SIZE = 4 * MB;
const ERROR_MESSAGES = {
  FILE_TOO_LARGE: "Przesyłane zdjęcie jest za duże. Maksymalny rozmiar zdjęcia to 4MB",
  PROCESSING_ERROR: "Coś poszło nie tak, spróbuj ponownie.",
  NO_PRODUCTS_FOUND: "Nie znaleziono produktów na zdjęciu, spróbuj ponownie.",
  INVALID_FORMAT: "Nie znaleziono produktów na przesłanym zdjęciu, spróbuj ponownie."
};

const runGemini = async (
  prompt = "What's difference between these pictures?",
  imageParts: (string | Part)[]
): Promise<string | { error: boolean; message: string }> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });
  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    return await response.text();
  } catch (error: unknown) {
    return { error: true, message: (error as { message: string }).message };
  }
};

const checkResponseError = (response: any) => {
  if (typeof response !== "string" && response?.error) {
    throw new Error(ERROR_MESSAGES.PROCESSING_ERROR);
  }
  if (response.toString().trim() === "null") {
    throw new Error(ERROR_MESSAGES.NO_PRODUCTS_FOUND);
  }
};

const parseResponse = (response: string): ProductFormat[] => {
  if (response.includes("{")) {
    const answer = JSON.parse(response) as ProductFormat[];

    if (answer?.[0]?.label?.trim() === "null" || answer?.[0]?.label?.trim() === null) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    return answer;
  }
  throw new Error(ERROR_MESSAGES.PROCESSING_ERROR);
};

const handleImageProcessing = async (
  result: ImagePicker.ImagePickerResult,
  callback: (data: any) => void,
  prompt: string
) => {
  if (result.canceled) return;

  // @ts-expect-error ImagePickerResult returns `filesize` instead of `fileSize` - wrong types.
  const { base64: image, filesize, mimeType } = result.assets[0];

  if (filesize >= MAX_FILE_SIZE) {
    throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  const payload: (string | Part)[] = [
    {
      inlineData: { mimeType, data: image }
    }
  ];

  const response = await runGemini(prompt, payload);

  checkResponseError(response);

  try {
    const answer = parseResponse(response as string);
    callback(answer);
  } catch (error) {
    console.error(error);
    throw new Error(ERROR_MESSAGES.PROCESSING_ERROR);
  }
};

export const fetchGeminiProduct = async ({
  setProducts,
  result
}: {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  result: ImagePicker.ImagePickerResult;
}): Promise<void> => {
  const productPrompt =
    "Extract product label and price without currency from this image and return it with JSON format (with keys 'label' and 'price'). If no price was found, ignore previous command and return trimmed 'null' value instead of object.";

  await handleImageProcessing(
    result,
    (product: ProductFormat) => {
      setProducts((prevState) => [
        ...prevState,
        {
          imageUri: result.assets[0].uri,
          product: {
            ...product,
            price: normalizePrice(product.price)
          },
          quantity: 1,
          key: Crypto.randomUUID()
        }
      ]);
    },
    productPrompt
  );
};

export const fetchGeminiReceipt = async ({
  setReceipt,
  result
}: {
  setReceipt: React.Dispatch<React.SetStateAction<Receipt>>;
  result: ImagePicker.ImagePickerResult;
}): Promise<void> => {
  const receiptPrompt =
    "Extract all products from receipt, with price without currency and quantity from given image and return it with JSON format: Array of following object { id: '', label: '', price:'', weight: '', quantity: '' } . If no price or label or quantity was found, ignore previous command and return trimmed 'null' value instead of object.";
  await handleImageProcessing(
    result,
    (products: ProductFormat[]) => {
      setReceipt({
        imageUri: result.assets[0].uri,
        products: products.map((product) => ({
          ...product,
          price: normalizePrice(product.price)
        })),
        key: Crypto.randomUUID()
      });
    },
    receiptPrompt
  );
};
