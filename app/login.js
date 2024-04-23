import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from "react-native";

import { appContext } from "./appContext";

const boundedHeight = Dimensions.get("window").height;

const Login = () => {
  const { setIsLoggedIn } = useContext(appContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const cancelLogin = () => {
    router.replace("/");
  };

  const createAccount = () => {
    router.push("/register");
  };

  const loginUser = () => {
    if (!email) {
      Alert.alert("Please enter your email address");
    } else if (!password) {
      Alert.alert("Please enter a password");
    } else {
      AsyncStorage.getItem("userLoggedIn", (err, result) => {
        if (result !== "none") {
          Alert.alert("Someone already logged in");
          router.replace("/");
        } else {
          AsyncStorage.getItem(email, (err, result) => {
            if (result !== null) {
              const userJSON = JSON.parse(result);
              if (userJSON.passwrd !== password) {
                Alert.alert("Password Incorrect");
              } else {
                AsyncStorage.setItem("userLoggedIn", email, () => {
                  console.log("matching password", userJSON);
                  setIsLoggedIn(true);
                  router.push("/");
                });
              }
            } else {
              Alert.alert(`No account for ${email}`);
            }
          });
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formView}>
        <Text style={styles.formTitle}>REGISTER AN ACCOUNT</Text>
        <Text style={styles.formLabel}>Email</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter Email"
          inputMode="email"
        />
        <Text style={styles.formLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setPassword}
          value={password}
          placeholder="Enter Password"
          secureTextEntry
        />

        <TouchableOpacity onPress={loginUser}>
          <Text style={styles.formButtonLabel}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelLogin}>
          <Text style={styles.formButtonLabel}>CANCEL LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={createAccount}>
          <Text style={styles.formButtonLabel}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: boundedHeight,
    ...Platform.select({
      android: {
        paddingBottom: 160,
      },
      ios: {
        paddingBottom: 160,
      },
      default: {
        paddingBottom: 20,
      },
    }),
  },
  formView: {
    alignItems: "center",
  },
  formTitle: {
    fontFamily: "WorkSans-Regular",
    fontWeight: "700",
    ...Platform.select({
      android: {
        fontSize: 20,
        paddingVertical: 10,
      },
      ios: {
        fontSize: 20,
        paddingVertical: 10,
      },
      default: {
        fontSize: 30,
        paddingVertical: 20,
      },
    }),
  },
  formLabel: {
    fontFamily: "WorkSans-Regular",
    fontWeight: "500",
    ...Platform.select({
      android: {
        fontSize: 16,
        paddingTop: 10,
      },
      ios: {
        fontSize: 16,
        paddingTop: 10,
      },
      default: {
        fontSize: 24,
        paddingTop: 18,
      },
    }),
  },
  formInput: {
    fontFamily: "WorkSans-Regular",
    width: 250,
    borderWidth: 1,
    padding: 10,
    ...Platform.select({
      android: {
        fontSize: 16,
      },
      ios: {
        fontSize: 16,
      },
      default: {
        fontSize: 24,
        width: 400,
      },
    }),
  },
  formButtonLabel: {
    fontFamily: "WorkSans-Regular",
    fontWeight: "500",
    ...Platform.select({
      android: {
        fontSize: 16,
        paddingTop: 12,
      },
      ios: {
        fontSize: 16,
        paddingTop: 12,
      },
      default: {
        fontSize: 24,
        paddingTop: 20,
      },
    }),
  },
});

export default Login;
