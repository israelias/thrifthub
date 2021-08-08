import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import merge from 'deepmerge';

export const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#1ba1f2',
  },
};

export const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#1ba1f2',
  },
};

// export const CombinedDefaultTheme = merge(
//   PaperDefaultTheme,
//   NavigationDefaultTheme
// );
// export const CombinedDarkTheme = merge(
//   PaperDarkTheme,
//   NavigationDarkTheme
// );
