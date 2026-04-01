import { useMutation } from "@tanstack/react-query";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AppContext } from "app/context/appContext";
import React from "react";

import Home from "../../Home";

// Mock the dependencies
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn()
}));

jest.mock("./api", () => ({
  fetchGeminiProduct: jest.fn()
}));

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: "Images"
  }
}));

const mockProducts = [
  {
    key: "1",
    imageUri: "https://example.com/image1.jpg",
    product: { label: "Product 1", price: 10, quantity: 1 }
  },
  {
    key: "2",
    imageUri: "https://example.com/image2.jpg",
    product: { label: "Product 2", price: 20, quantity: 1 }
  }
];

const mockSetProducts = jest.fn();

describe("Home Component", () => {
  beforeEach(() => {
    (useMutation as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
      reset: jest.fn()
    });
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <AppContext.Provider value={{ products: mockProducts, setProducts: mockSetProducts, receipt: null, setReceipt: jest.fn() }}>
        <Home />
      </AppContext.Provider>
    );

    expect(getByText("Product 1")).toBeTruthy();
    expect(getByText("Product 2")).toBeTruthy();
  });

  it("shows modal when showModal is called", async () => {
    const { getByText, queryByText } = render(
      <AppContext.Provider value={{ products: mockProducts, setProducts: mockSetProducts, receipt: null, setReceipt: jest.fn() }}>
        <Home />
      </AppContext.Provider>
    );

    const product1 = getByText("Product 1");
    fireEvent.press(product1);

    await waitFor(() => {
      expect(queryByText("Zamknij")).toBeTruthy();
    });
  });

  it("hides modal when hideModal is called", async () => {
    const { getByText, queryByText } = render(
      <AppContext.Provider value={{ products: mockProducts, setProducts: mockSetProducts, receipt: null, setReceipt: jest.fn() }}>
        <Home />
      </AppContext.Provider>
    );

    const product1 = getByText("Product 1");
    fireEvent.press(product1);

    await waitFor(() => {
      expect(queryByText("Zamknij")).toBeTruthy();
    });

    const closeButton = getByText("Zamknij");
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(queryByText("Zamknij")).toBeNull();
    });
  });
});
