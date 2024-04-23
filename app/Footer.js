import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

const windowDimensions = Dimensions.get("window");
const WinHeight = windowDimensions.height;

const Footer = () => {
  const router = useRouter();
  return (
    <View style={styles.footer}>
      <Text
        style={styles.menu}
        onPress={() => {
          router.push("/");
        }}
      >
        Home
      </Text>
      <Text
        style={styles.menu}
        onPress={() => {
          router.push("/photos");
        }}
      >
        Zdjęcia
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    height: 50,
    width: "100%",
    flexDirection: "row",
    ...Platform.select({
      android: {
        position: "absolute",
        top: WinHeight - 50,
      },
      ios: {
        position: "absolute",
        top: WinHeight - 50,
      },
      default: {
        position: "relative",
        bottom: 0,
      },
    }),
  },
  smallLogoStyle: {
    height: 30,
    width: 30,
    ...Platform.select({
      android: {
        marginLeft: 23,
      },
      ios: {
        marginLeft: 23,
      },
      default: {
        left: "-35%",
      },
    }),
  },
  menu: {
    paddingLeft: 25,
    paddingRight: 25,
    color: "#FFFFFF",
    fontFamily: "WorkSans-Regular",
    fontWeight: "700",
  },
});

export default Footer;
