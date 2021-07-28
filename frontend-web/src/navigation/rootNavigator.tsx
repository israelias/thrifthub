import * as React from "react";
import {
  NavigationContainerRef,
  ParamListBase,
  StackActions,
  StackActionType,
} from "@react-navigation/native";

let navigators: NavigationContainerRef;

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name: string, params: ParamListBase) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function push(name: string, params?: object | undefined) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

export const changeStack = (stackName: string) => {
  resetRoot(stackName);
};

const resetRoot = (routeName: string) => {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{ name: routeName }],
  });
};

export { navigators };
