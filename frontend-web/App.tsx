import React from "react";
import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { extendTheme } from "native-base";
import NativeBaseProvider from "./context/nativebase.context";
import { Platform } from "react-native";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NativeBaseProvider>
        {/* <IconRegistry icons={EvaIconsPack} /> */}
        {/* <ApplicationProvider {...eva} theme={eva.light}> */}
        <SafeAreaProvider>
          {/* <HomeScreen /> */}
          {/* <AppNavigator /> */}
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
        {/* </ApplicationProvider> */}
      </NativeBaseProvider>
    );
  }
}
