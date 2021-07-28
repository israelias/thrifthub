import React from "react";
import { StyleSheet, TextInputProps } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function Header({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Text
      style={{
        fontSize: 21,
        color: theme.colors.primary,
        fontWeight: "bold",
        paddingVertical: 12,
      }}
    >
      {children}{" "}
    </Text>
  );
}
