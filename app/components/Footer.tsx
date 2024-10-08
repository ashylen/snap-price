import { THEME } from "app/constants";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { IconButton, MD3Colors } from "react-native-paper";

const windowDimensions = Dimensions.get("window");
const WinHeight = windowDimensions.height;

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const backgroundColor =
    pathname === "/" ? THEME.shoppingList.backgroundColor : THEME.receipt.backgroundColor;

  return (
    <View style={{ ...styles.footer, backgroundColor }}>
      <IconButton
        icon="home"
        iconColor={MD3Colors.neutral90}
        size={28}
        onPress={() => {
          router.replace("/");
        }}
      />

      <IconButton
        icon="cart-check"
        iconColor={MD3Colors.neutral90}
        size={28}
        onPress={() => {
          router.replace("/receipt");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#8290b5",
    height: 70,
    width: "100%",
    flexDirection: "row",
    ...Platform.select({
      android: {
        position: "absolute",
        top: WinHeight - 70
      },
      ios: {
        position: "absolute",
        top: WinHeight - 70
      },
      default: {
        position: "relative",
        bottom: 0
      }
    })
  }
});

export default Footer;
