import { useFonts } from "expo-font";
import { SplashScreen, Slot } from "expo-router";
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
  setStatusBarTranslucent,
} from "expo-status-bar";
import { useEffect } from "react";
import {
  PaperProvider,
  ActivityIndicator,
  MD2Colors,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "./Footer";
import { ContextProvider } from "./appContext.js";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  setStatusBarBackgroundColor("#36302c", false);
  setStatusBarStyle("light");
  setStatusBarTranslucent(false);

  const [fontsLoaded, fontError] = useFonts({
    "Hochstadt-Serif": require("../assets/fonts/Hochstadt-Serif.otf"),
    "TheGreatOutdoors-Regular": require("../assets/fonts/TheGreatOutdoors-Regular.otf"),
    "WorkSans-Regular": require("../assets/fonts/WorkSans-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      console.log("fonts loaded");
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ContextProvider>
      <PaperProvider>
        <SafeAreaView>
          {/* <Header /> */}
          <Slot />
          <Footer />
        </SafeAreaView>
      </PaperProvider>
    </ContextProvider>
  );
};

export default Layout;
