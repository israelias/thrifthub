import React from "react";
import { I18nManager } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import * as Updates from "expo-updates";
import { useColorScheme } from "react-native-appearance";

import { CoreNavigator } from "./navigation/coreNavigator";
import { PreferencesContext } from "./context/preferences.context";
import VendorDataProvider from "./context/vendor.context";
import ProductsDataProvider from "./context/products.context";
import AuthorizationProvider from "./context/authorization.context";
import AuthProvider, { useAuth } from "./context/auth.context";
import UserProvider from "./context/user.context";
import {
  CombinedDefaultTheme,
  CombinedDarkTheme,
} from "./components/common/theme";

export const Core = () => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<"light" | "dark">(
    colorScheme === "dark" ? "dark" : "light"
  );
  const [rtl] = React.useState<boolean>(I18nManager.isRTL);

  function toggleTheme() {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }

  const toggleRTL = React.useCallback(() => {
    I18nManager.forceRTL(!rtl);
    Updates.reloadAsync();
  }, [rtl]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      toggleRTL,
      theme,
      rtl: (rtl ? "right" : "left") as "right" | "left",
    }),
    [rtl, theme, toggleRTL]
  );

  return (
    <>
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider
          theme={theme === "light" ? CombinedDefaultTheme : CombinedDarkTheme}
        >
          <VendorDataProvider>
            <AuthorizationProvider>
              <>
                <ProductsDataProvider>
                  <UserProvider>
                    <CoreNavigator />
                  </UserProvider>
                </ProductsDataProvider>
              </>
            </AuthorizationProvider>
          </VendorDataProvider>
        </PaperProvider>
      </PreferencesContext.Provider>
    </>
  );
};
