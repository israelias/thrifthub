import React, { RefObject } from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useTheme, Portal, FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useIsFocused,
  RouteProp,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";

import { ProductScreen } from "../screens/products/productScreen";
import { FavoriteProductsScreen } from "../screens/vendor/favoritesScreen";
import { TransactionOrdersScreen } from "../screens/orders/transactionOrdersScreen";
import { MakeOfferScreen } from "../screens/vendor/makeOfferScreen";
import { AddProductScreen } from "../screens/vendor/addProductScreen";
import { Message } from "../components/account/messages";
import {
  OrderTransactionStackParamList,
  ProductStackNavigatorParamList,
} from "../types";

import overlay from "../utils/overlay";

import { AccountStackNavigator } from "./accountStackNavigator";
import { AuthContext } from "../context/authUtils";

const Tab = createMaterialBottomTabNavigator();

type OrderProps = {
  route: RouteProp<OrderTransactionStackParamList, "Order">;
};
type Props = {
  route: RouteProp<ProductStackNavigatorParamList, "Products">;
};

export const BottomTabs = (props: Props) => {
  const routeName = getFocusedRouteNameFromRoute(props.route) ?? "Store";
  const { state } = React.useContext(AuthContext);
  const theme = useTheme();
  const safeArea = useSafeAreaInsets();
  const isFocused = useIsFocused();

  let icon = "feather";

  switch (routeName) {
    case "Transactions":
      icon = "cash-multiple";
      break;
    default:
      icon = "feather";
      break;
  }

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface;

  // const [view, setView] = React.useState()

  const [renderStore, setRendorStore] = React.useState(false);
  React.useEffect(() => {
    if (state.isSignedIn) {
      setRendorStore(true);
    } else {
      setRendorStore(false);
    }
  }, [state]);

  return (
    <React.Fragment>
      <React.Fragment>
        <Tab.Navigator
          initialRouteName="Store"
          backBehavior="initialRoute"
          shifting={true}
          activeColor={theme.colors.primary}
          // inactiveColor={color(theme.colors.text).alpha(0.6).rgb().string()}
          // sceneAnimationEnabled={false}
        >
          <Tab.Screen
            name="Products"
            component={ProductScreen}
            options={{
              tabBarIcon: "package-variant",
              tabBarColor,
            }}
          />
          <Tab.Screen
            name="Transactions"
            component={TransactionOrdersScreen}
            options={{
              tabBarIcon: "cash-multiple",
              tabBarColor,
            }}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoriteProductsScreen}
            options={{
              tabBarIcon: "heart",
              tabBarColor,
            }}
          />
          <Tab.Screen
            name="My Products"
            component={ProductScreen}
            options={{
              tabBarIcon: "folder-home-outline",
              tabBarColor,
            }}
          />
          <Tab.Screen
            name="Add Product"
            component={AddProductScreen}
            options={{
              tabBarIcon: "folder-home-outline",
              tabBarColor,
            }}
          />
          <Tab.Screen
            name="Make Offer"
            component={MakeOfferScreen}
            options={{
              tabBarIcon: "folder-home-outline",
              tabBarColor,
            }}
          />
          <Tab.Screen
            name="Messages"
            component={Message}
            options={{
              tabBarIcon: "message-text-outline",
              tabBarColor,
            }}
          />
          {/* <Tab.Screen
          name="StartScreen"
          component={AccountStackNavigator}
          options={{
            tabBarIcon: "message-text-outline",
            tabBarColor,
          }}
        /> */}
        </Tab.Navigator>
        <Portal>
          <FAB
            visible={isFocused}
            icon={icon}
            style={{
              position: "absolute",
              bottom: safeArea.bottom + 65,
              right: 16,
            }}
            color="white"
            theme={{
              colors: {
                accent: theme.colors.primary,
              },
            }}
            onPress={() => {}}
          />
        </Portal>
      </React.Fragment>
    </React.Fragment>
  );
};
