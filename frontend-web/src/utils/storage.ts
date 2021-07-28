import AsyncStorage from "@react-native-async-storage/async-storage";

export const localStorage = {
  getToken: async () =>
    AsyncStorage.getItem("token").then((json: any) => {
      return JSON.parse(json);
    }),
  setToken: async (accessToken: AccessToken["accessToken"]) =>
    AsyncStorage.setItem("token", JSON.stringify(accessToken)),
  clearToken: async () => AsyncStorage.removeItem("token"),

  setLogoutEvent: () =>
    window.localStorage.setItem("app_logout", JSON.stringify(Date.now())),
};
