import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

export default function OpenBrowser({ path }: { path: string }) {
  const [result, setResult] =
    React.useState<WebBrowser.WebBrowserResult | null>(null);

  const _handlePressButtonAsync = async () => {
    const result = await WebBrowser.openBrowserAsync(path);
    result && setResult(result);
  };
  return (
    <View style={styles.container}>
      <Button title="Open WebBrowser" onPress={_handlePressButtonAsync} />
      <Text>{result && JSON.stringify(result)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
});
