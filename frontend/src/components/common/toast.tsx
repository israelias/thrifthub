import React from 'react';
import color from 'color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Snackbar,
  useTheme,
  Avatar,
  Text,
} from 'react-native-paper';
import overlay from '../../utils/overlay';

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
  duration = 2500,
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
  const theme = useTheme();
  const safeArea = useSafeAreaInsets();

  const surfaceColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.background;

  const textColor = color(theme.colors.text)
    .alpha(0.6)
    .rgb()
    .string();

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const borderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  return (
    <View style={styles.container}>
      <Snackbar
        color={textColor}
        style={[
          styles.snackBar,
          {
            bottom: safeArea.bottom + 65,
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          },
        ]}
        visible={open}
        onDismiss={() => setOpen(false)}
        duration={duration}
        action={{
          // @ts-ignore
          label: error ? (
            <Avatar.Icon
              size={24}
              icon="alert-decagram-outline"
              color={theme.colors.error}
            />
          ) : warning ? (
            <Avatar.Icon
              size={24}
              icon="alert-outline"
              color={theme.colors.error}
            />
          ) : info ? (
            <Avatar.Icon
              size={24}
              icon="information-outline"
              color={theme.colors.notification}
            />
          ) : (
            <Avatar.Icon
              size={24}
              icon="check"
              color={theme.colors.accent}
            />
          ),
          onPress: () => setOpen(false),
        }}
      >
        <Text style={{ color: contentColor }}>{message}</Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  snackBar: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
