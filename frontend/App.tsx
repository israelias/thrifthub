import React from "react";
import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppearanceProvider } from "react-native-appearance";
// import AuthorizationProviderfrom from './src/context/authorization.context'
import useCachedResources from "./src/hooks/useCachedResources";
import AppLoader from "./native/AppLoader";
import { Core } from "./src/core";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return <AppLoader />;
  } else {
    return (
      <>
        <AppearanceProvider>
          <SafeAreaProvider>
            <Core />
            {/* <Main /> */}
            {/* <StatusBar /> */}
          </SafeAreaProvider>
        </AppearanceProvider>
      </>
    );
  }
}
