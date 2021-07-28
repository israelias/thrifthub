import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar } from "react-native-paper";

/**
 * The main prompt for all messages following fetch methods.
 *
 * @file defines feedback toast that relays message from backend.
 * @date 2021-07-18
 */

export const Toast = ({
  open,
  setOpen,
  success,
  error,
  warning,
  info,
  message,
  duration = 750,
}: {
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  info?: boolean;
  open: boolean;
  message?: string | any;
  duration?: number;
  label?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <View style={styles.container}>
      <Snackbar
        visible={open}
        onDismiss={() => setOpen(false)}
        duration={duration}
        action={{
          label: error
            ? "Error"
            : warning
            ? "Warning"
            : info
            ? "Info"
            : "Success",
          onPress: () => setOpen(false),
        }}
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
