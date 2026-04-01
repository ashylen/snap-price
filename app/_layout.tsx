import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuthContext } from "app/context/authContext";
import { ContextProvider } from "app/context/appContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, PaperProvider, Text } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const AppNavigator = () => {
  const { authReady } = useAuthContext();

  if (!authReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Logowanie...</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Hochstadt-Serif": require("../assets/fonts/Hochstadt-Serif.otf"),
    "TheGreatOutdoors-Regular": require("../assets/fonts/TheGreatOutdoors-Regular.otf"),
    "WorkSans-Regular": require("../assets/fonts/WorkSans-Regular.ttf")
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  if (fontError) {
    return (
      <View style={styles.center}>
        <Text>Error loading fonts: {fontError.message}</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ContextProvider>
            <AppNavigator />
          </ContextProvider>
        </AuthProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});
