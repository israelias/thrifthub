import React from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useColorScheme from '../hooks/useColorScheme';

import { THEME_PERSISTENCE_KEY } from '../constants/keys.constants';

import {
  CombinedDefaultTheme,
  CombinedDarkTheme,
} from '../components/common/theme';

type PreferencesContextType = {
  theme: typeof CombinedDefaultTheme | typeof CombinedDarkTheme;
  rtl: 'left' | 'right';
  toggleTheme: () => void;
  toggleRTL: () => void;
  isThemeDark: boolean;
  setIsThemeDark: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PreferencesContext =
  React.createContext<PreferencesContextType>(undefined!);

export default function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme();

  console.log('Preferences: colorscheme', colorScheme);

  const [rtl] = React.useState<boolean>(I18nManager.isRTL);
  const [isThemeDark, setIsThemeDark] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const themeAsync = async () => {
      try {
        const themeName = await AsyncStorage?.getItem(
          THEME_PERSISTENCE_KEY
        );

        console.log(
          'Storage themePersistence: ',
          THEME_PERSISTENCE_KEY
        );

        setIsThemeDark(themeName === 'dark' ? true : false);
      } catch (e) {
        // Ignore
      }
    };
    themeAsync();
  }, []);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => {
        setIsThemeDark(!isThemeDark);
        AsyncStorage?.setItem(
          THEME_PERSISTENCE_KEY,
          isThemeDark ? 'light' : 'dark'
        );
      },

      toggleRTL: () => I18nManager.forceRTL(!rtl),
      isThemeDark,
      setIsThemeDark,
      theme: isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme,

      rtl: (rtl ? 'right' : 'left') as 'right' | 'left',
    }),
    [rtl, isThemeDark]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreference = () =>
  React.useContext(PreferencesContext);
