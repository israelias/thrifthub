import React from "react";
import Background from "../../components/common/Background";

import { Paragraph, Button, Headline as Header } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { AccountStackNavigatorParamList } from "../../types";

export default function StartScreen({
  navigation,
}: {
  navigation: StackNavigationProp<AccountStackNavigatorParamList>;
}) {
  return (
    <Background>
      <Header>Login Template</Header>
      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Sign Up
      </Button>
    </Background>
  );
}
