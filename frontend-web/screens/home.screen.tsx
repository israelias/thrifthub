import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Box, Divider } from "native-base";

import { ProductCardPreview } from "../components/card";

export default function TabOneScreen() {
  return (
    <View>
      <Box style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Divider />
        {/* <ProductCardPreview /> */}
        <EditScreenInfo path="/screens/home.screen.tsx" />
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
