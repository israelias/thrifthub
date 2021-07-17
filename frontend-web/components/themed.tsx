/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  ITextProps,
} from "native-base";

import { ViewProps as DefaultViewProps } from "react-native";

import Colors from "../constants/colors.constants";
import useColorScheme from "../hooks/useColorScheme";
import { useColorModeValue } from "native-base";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ITextProps;
// export type ViewProps = DefaultViewProps & React.ReactNode;
// export type TextProps = ThemeProps & DefaultText["props"];
// export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: ITextProps) {
  // const { style, lightColor, darkColor, ...otherProps } = props;
  // const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText color={useColorModeValue("black", "white")} {...props} />;
}

export function View({
  props,
  children,
}: {
  props?: DefaultViewProps;
  children?: React.ReactNode;
}) {
  // const { style, lightColor, darkColor, ...otherProps } = props;
  // const backgroundColor = useThemeColor(
  //   { light: lightColor, dark: darkColor },
  //   "background"
  // );

  return (
    <DefaultView
      bg={useColorModeValue("#eee", "rgba(255,255,255,0.1)")}
      {...props}
    >
      {children}
    </DefaultView>
  );
}
