import React from 'react';
import { I18nManager } from 'react-native';

import useColorScheme from '../hooks/useColorScheme';

type PreferencesContextType = {
  theme: 'light' | 'dark';
  rtl: 'left' | 'right';
  toggleTheme: () => void;
  toggleRTL: () => void;
  isThemeDark: boolean;
};

export const PreferencesContext =
  React.createContext<PreferencesContextType>(undefined!);

export default function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme();

  const [rtl] = React.useState<boolean>(I18nManager.isRTL);
  const [isThemeDark, setIsThemeDark] =
    React.useState<boolean>(false);

  React.useMemo(() => {
    if (colorScheme === 'dark') {
      console.log(
        'PreferenceProvider: useMemo: if ColoScheme === dark',
        colorScheme
      );
      setIsThemeDark(true);
    }
  }, [colorScheme]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => setIsThemeDark(!isThemeDark),
      toggleRTL: () => I18nManager.forceRTL(!rtl),
      isThemeDark,
      theme: colorScheme,
      rtl: (rtl ? 'right' : 'left') as 'right' | 'left',
    }),
    [rtl, colorScheme, isThemeDark]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreference = () =>
  React.useContext(PreferencesContext);
