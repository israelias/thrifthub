import React, { useState } from "react";

import { TouchableOpacity, StyleSheet, View } from "react-native";
import {
  Text,
  useTheme,
  TextInput,
  Button,
  Surface,
  Headline,
} from "react-native-paper";
import Background from "../../components/common/background";

import Header from "../../components/common/header";
import BackButton from "../../components/common/backButton";
import { emailValidator } from "../../utils/emailValidator";
import { passwordValidator } from "../../utils/passwordValidator";

import { useUserContext } from "../../context/user.context";
import { StackNavigationProp } from "@react-navigation/stack";
import { AccountStackNavigatorParamList } from "../../types";
import { SignIn } from "../../components/account/accounSign";
export default function LoginScreen({
  navigation,
}: {
  navigation: StackNavigationProp<AccountStackNavigatorParamList>;
}) {
  const theme = useTheme();
  // const { username, setUsername, email, setEmail, password, setPassword } = useUserContext()
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  return (
    <Background>
      <TouchableOpacity onPress={() => navigation.goBack} />

      <Headline>Welcomggge back.</Headline>
      <SignIn />
      {/* <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text: string) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={{ fontSize: 13, color: theme.colors.text }}>
            Forgot your password?
          </Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={{ fontWeight: "bold", color: theme.colors.primary }}>
            Sign up
          </Text>
        </TouchableOpacity> */}
      {/* </View> */}
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    padding: 20,
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
});
