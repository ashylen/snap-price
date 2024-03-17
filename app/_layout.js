import { useEffect } from "react";
import { SplashScreen, Slot } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
  setStatusBarTranslucent,
} from "expo-status-bar";
import { BethanyProvider } from "./bethanyContext.js";
import Header from "./Header";
import Footer from "./Footer";

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
    <BethanyProvider>
      <SafeAreaView>
        {/* <Header /> */}
        <Slot />
        <Footer />
      </SafeAreaView>
    </BethanyProvider>
  );
};

export default Layout;
