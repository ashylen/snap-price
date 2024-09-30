import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "app/context/appContext";
import { useFonts } from "expo-font";
import { SplashScreen, Slot, usePathname } from "expo-router";
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
  setStatusBarTranslucent
} from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider, ActivityIndicator, MD2Colors, Text, Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "./components/Footer";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const Layout = () => {
  setStatusBarBackgroundColor("#36302c", false);
  setStatusBarStyle("light");
  setStatusBarTranslucent(false);

  const pathname = usePathname();

  const [fontsLoaded, fontError] = useFonts({
    "Hochstadt-Serif": require("../assets/fonts/Hochstadt-Serif.otf"),
    "TheGreatOutdoors-Regular": require("../assets/fonts/TheGreatOutdoors-Regular.otf"),
    "WorkSans-Regular": require("../assets/fonts/WorkSans-Regular.ttf")
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      console.log("fonts loaded");
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded) {
    return (
      <View style={styles.fixedContainer}>
        <Text>
          <ActivityIndicator animating color={MD2Colors.red800} size="large" />
        </Text>
      </View>
    );
  }

  if (fontError) {
    return (
      <View>
        <Text>Error occured: {fontError.message}</Text>
      </View>
    );
  }

  console.log("pathname:", pathname);
  return (
    <PaperProvider>
      <QueryClientProvider client={queryClient}>
        <ContextProvider>
          <SafeAreaView>
            <Appbar.Header>
              {/* <Appbar.BackAction onPress={() => {}} /> */}
              <Appbar.Content title={pathname === "/" ? "Lista zakupów" : "Paragon"} />
            </Appbar.Header>
            <Slot />
            <Footer />
          </SafeAreaView>
        </ContextProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  fixedContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Layout;
