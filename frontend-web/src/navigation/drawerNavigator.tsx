import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { StackNavigator } from "./productStackNavigator";
import { DrawerContent } from "../screens/vendor/drawerContent";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={StackNavigator} />
    </Drawer.Navigator>
  );
};
