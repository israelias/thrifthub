import React from "react";
import { StyleSheet, TextInputProps } from "react-native";
import { Text } from "react-native-paper";

interface Props extends TextInputProps {
  children: React.ReactNode;
}
export default function Paragraph({ children, ...props }: Props) {
  return (
    <Text style={styles.text} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 12,
  },
});
