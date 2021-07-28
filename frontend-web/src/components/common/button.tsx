import React from "react";
import { StyleSheet, RegisteredStyle, StyleProp } from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";

export default function Button({
  children,
}: // mode,
{
  children: React.ReactNode;
  // mode: React.ComponentClass;
}) {
  const theme = useTheme();
  return (
    <PaperButton
      style={styles.button}
      labelStyle={styles.text}
      // mode={mode}
      // {...props}
    >
      {children}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});
