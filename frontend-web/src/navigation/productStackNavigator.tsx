import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Appbar, Avatar, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { BottomTabs } from "./bottomTabNavigator";
import { ProductDetailScreen } from "../screens/products/productDetailScreen";

import { ProductStackNavigatorParamList } from "../types";

import { useAuth } from "../context/auth.context";
import { useVendorData } from "../context/vendor.context";
import { useVendorIcon } from "../hooks/useVendorIcon";

const Stack = createStackNavigator<ProductStackNavigatorParamList>();

export const StackNavigator = () => {
  const theme = useTheme();

  const { vendorInitials, vendorIcon } = useVendorIcon();

  return (
    <Stack.Navigator
      initialRouteName="Products"
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
                  {vendorIcon ? (
                    <Avatar.Image
                      size={40}
                      source={{
                        uri: vendorIcon,
                      }}
                    />
                  ) : vendorInitials ? (
                    <Avatar.Text size={40} label={vendorInitials} />
                  ) : (
                    <Avatar.Icon size={40} icon="account" />
                  )}
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={
                  title === "Store" ? (
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
      <Stack.Screen
        name="Products"
        component={BottomTabs}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Store";
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailScreen}
        options={{ headerTitle: "Product Details" }}
      />
    </Stack.Navigator>
  );
};
