import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import localStorage from "../utils/localstorage";
const STORAGE_KEY = "ASYNC_STORAGE_NAME_EXAMPLE";

export default function useAsyncStorage() {
  const [name, setName] = useState("World");

  async function loadName() {
    try {
      // const name = await AsyncStorage.getItem(STORAGE_KEY);
      const name = await localStorage.getItem("authId");

      if (name === null) return;

      setName(name.user.name);
    } catch (e) {
      console.error("Failed to load name.");
    }
  }

  async function saveName(name: string) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, name);
      setName(name);
    } catch (e) {
      console.error("Failed to save name.");
    }
  }

  useEffect(() => {
    loadName();
  }, []);

  return name;
  // <>
  // // { children}
  //   // <Input
  //   //   placeholder={"Type your name, hit enter, and refresh!"}
  //   //   onSubmitEditing={(value) => {
  //   //     saveName(value);
  //   //   }}
  //   // />
  //   // <Text style={styles.text}>Hello {name}!</Text>
  // </>
}

const styles = StyleSheet.create({
  text: {
    padding: 15,
    backgroundColor: "#EEB",
  },
});
