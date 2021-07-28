import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Appbar, Avatar, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { TouchableOpacity } from "react-native";
import { DEFAULT_AVATAR } from "../constants/backend.constants";

import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from "../screens/account";

import { AccountStackNavigatorParamList } from "../types";

const AccountStack = createStackNavigator<AccountStackNavigatorParamList>();

export const AccountStackNavigator = () => {
  const theme = useTheme();
  // console.log(AccountStack);

  return (
    <AccountStack.Navigator
      initialRouteName="StartScreen"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => {
          const { options } = scene.descriptor;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : scene.route.name;

          return (
            <Appbar.Header
              theme={{ colors: { primary: theme.colors.surface } }}
            >
              {previous ? (
                <Appbar.BackAction
                  onPress={navigation.goBack}
                  color={theme.colors.primary}
                />
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    (
                      navigation as any as DrawerNavigationProp<{}>
                    ).openDrawer();
                  }}
                >
                  <Avatar.Image
                    size={40}
                    source={{
                      uri: DEFAULT_AVATAR,
                    }}
                  />
                </TouchableOpacity>
              )}

              <Appbar.Content
                title={
                  title === "StartScreen" ? (
                    <MaterialCommunityIcons
                      style={{ marginRight: 10 }}
                      name="package-variant-closed"
                      size={40}
                      color={theme.colors.primary}
                    />
                  ) : (
                    title
                  )
                }
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: theme.colors.primary,
                }}
              />
            </Appbar.Header>
          );
        },
      }}
    >
      <AccountStack.Screen
        name="StartScreen"
        component={StartScreen}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? "StartScreen";
          return { headerTitle: routeName };
        }}
      />
      <AccountStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerTitle: "Sign In" }}
      />
      <AccountStack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerTitle: "Register" }}
      />
      <AccountStack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerTitle: "Dashboard" }}
      />
      <AccountStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerTitle: "Reset Password" }}
      />
    </AccountStack.Navigator>
  );
};
