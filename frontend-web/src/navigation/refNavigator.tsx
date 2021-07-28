import React from "react";
import {
  NavigationContainerRef,
  ParamListBase,
  StackActions,
  NavigationContainer,
} from "@react-navigation/native";

let navigator: NavigationContainerRef;

// export const navigationRef = React.createRef<NavigationContainerRef>();

const setTopLevelNavigator = (navigatorRef: NavigationContainerRef | null) => {
  if (navigatorRef) {
    navigator = navigatorRef;
  }
};

const navigate = (routeName: string, params?: ParamListBase) => {
  if (navigator) {
    navigator.dispatch(StackActions.push(routeName, params));
  }
};

// export function navigate(routeName: string, params: ParamListBase) {
//   if (navigator) {
//     navigator.dispatch(StackActions.navigate(name, params);
//   }
// }

export { setTopLevelNavigator, navigate };
