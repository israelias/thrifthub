import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  getToken: async () =>
    AsyncStorage.getItem("token").then((json: any) => {
      return JSON.parse(json);
    }),
  setToken: async (accessToken: string) =>
    AsyncStorage.setItem("token", JSON.stringify(accessToken)),
  clearToken: async () => AsyncStorage.removeItem("token"),
  // getToken: () => JSON.parse(window.localStorage.getItem("token") || "{}"),
  // setToken: (token: string) =>
  //   window.localStorage.setItem("token", JSON.stringify(token)),
  // clearToken: () => window.localStorage.removeItem("token"),
  setUserLocal: (username: string) =>
    localStorage.setItem("username", username),
  getUserLocal: () => JSON.parse(window.localStorage.getItem("username") || ""),
  clearUserLocal: () => window.localStorage.removeItem("username"),
  setLogoutEvent: () =>
    window.localStorage.setItem("app_logout", JSON.stringify(Date.now())),
};
