import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { getStatusBarHeight } from "react-native-status-bar-height";

import {
  StackNavigationProp,
  StackHeaderLeftButtonProps,
} from "@react-navigation/stack";
import { AccountStackNavigatorParamList } from "../../types";

export default function BackButton({
  goBack,
}: {
  goBack: StackHeaderLeftButtonProps;
}) {
  const image = { uri: "https://reactjs.org/logo-og.png" };
  return (
    <TouchableRipple onPress={() => goBack} style={styles.container}>
      <Image style={styles.image} source={image} />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
});
