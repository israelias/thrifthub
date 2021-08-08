import { Fragment } from 'react';
import {
  Appearance as AppearanceOriginal,
  ColorSchemeName as ColorSchemeNameOriginal,
} from 'react-native';

export type ColorSchemeName = 'light' | 'dark';

export interface AppearancePreferences {
  colorScheme: ColorSchemeName;
}

type AppearanceListener = (
  preferences: AppearancePreferences
) => void;

export interface Appearence {
  addChangeListener: (listener: AppearanceListener) => {
    remove: () => void;
  };
  getColorScheme(): ColorSchemeName;
}

export const AppearanceProvider = Fragment;

export const Appearance: Appearence = {
  addChangeListener(listener) {
    AppearanceOriginal.addChangeListener((preferences) => {
      const _colorScheme = preferences && preferences.colorScheme;
      listener({ colorScheme: normalizeColorScheme(_colorScheme) });
    });

    return {
      remove: () => {
        AppearanceOriginal.removeChangeListener(listener as any);
      },
    };
  },
  getColorScheme() {
    return normalizeColorScheme(AppearanceOriginal.getColorScheme());
  },
};

function normalizeColorScheme(
  colorSchemeOriginal: ColorSchemeNameOriginal
): ColorSchemeName {
  if (
    colorSchemeOriginal === 'light' ||
    colorSchemeOriginal === 'dark'
  )
    return colorSchemeOriginal;

  return 'light';
}
