import React from "react";
import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import NativeBaseProvider from "./context/nativebase.context";
import { Provider as PaperProvider } from "react-native-paper";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import UserProvider from "./context/user.context";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider>
        <NativeBaseProvider>
          <UserProvider>
            {/* <IconRegistry icons={EvaIconsPack} /> */}
            {/* <ApplicationProvider {...eva} theme={eva.light}> */}
            <SafeAreaProvider>
              {/* <HomeScreen /> */}
              {/* <AppNavigator /> */}
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
            {/* </ApplicationProvider> */}
          </UserProvider>
        </NativeBaseProvider>
      </PaperProvider>
    );
  }
}
