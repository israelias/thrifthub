import * as SecureStore from "expo-secure-store";

export const nativeStorage = {
  getToken: async () =>
    SecureStore.getItemAsync("token").then((json: any) => {
      return JSON.parse(json);
    }),
  setToken: async (accessToken: AccessToken["accessToken"]) =>
    SecureStore.setItemAsync("token", JSON.stringify(accessToken)),
  clearToken: async () => SecureStore.deleteItemAsync("token"),

  setLogoutEvent: () =>
    window.localStorage.setItem("app_logout", JSON.stringify(Date.now())),
};
