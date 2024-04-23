import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from "react-native";

const boundedHeight = Dimensions.get("window").height;

const Register = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const cancelRegistration = () => {
    router.replace("/");
  };

  const registerUser = () => {
    if (!email) {
      Alert.alert("Please enter an email!");
    } else if (!firstName) {
      Alert.alert("Please enter your first name!");
    } else if (!lastName) {
      Alert.alert("Please enter your last name!");
    } else if (!password) {
      Alert.alert("Please enter a password!");
    } else if (!passwordConfirm) {
      Alert.alert("Please confirm your password!");
    } else if (password !== passwordConfirm) {
      Alert.alert("Passwords do not match!");
    } else {
      AsyncStorage.getItem(email, (err, result) => {
        if (result !== null) {
          Alert.alert(`${email} user already exists`);
        } else {
          const USER = {
            fname: firstName,
            lname: lastName,
            passwrd: password,
          };
          const userJSON = JSON.stringify(USER);
          console.log("User Object :", userJSON);
          AsyncStorage.setItem(email, userJSON, () => {
            Alert.alert(`Account created for ${email}`);
          });
          router.replace("/");
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formView}>
        <Text style={styles.formTitle}>REGISTER AN ACCOUNT</Text>
        <Text style={styles.formLabel}>First Name</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setFirstName}
          value={firstName}
          placeholder="Enter First Name"
        />
        <Text style={styles.formLabel}>Last Name</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setLastName}
          value={lastName}
          placeholder="Enter Last Name"
        />
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
        <Text style={styles.formLabel}>Confirm Password</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setPasswordConfirm}
          value={passwordConfirm}
          placeholder="Confirm your password"
          secureTextEntry
        />
        <TouchableOpacity onPress={registerUser}>
          <Text style={styles.formButtonLabel}>REGISTER ACCOUNT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelRegistration}>
          <Text style={styles.formButtonLabel}>CANCEL</Text>
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
        paddingBottom: 360,
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

export default Register;
