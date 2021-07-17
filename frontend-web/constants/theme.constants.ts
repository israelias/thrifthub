import { extendTheme } from "native-base";

export default extendTheme({
  colors: {
    // Add new color
    primary: {
      50: "#E3F2F9",
      100: "#C5E4F3",
      200: "#A2D4EC",
      300: "#7AC1E4",
      400: "#47A9DA",
      500: "#0088CC",
      600: "#007AB8",
      700: "#006BA1",
      800: "#005885",
      900: "#003F5E",
    },
    // Redefinig only one shade, rest of the color will remain same.
    amber: {
      400: "#d97706",
    },
  },

  fontConfig: {
    Roboto: {
      100: {
        normal: "Roboto-Light",
        italic: "Roboto-LightItalic",
      },
      200: {
        normal: "Roboto-Light",
        italic: "Roboto-LightItalic",
      },
      300: {
        normal: "Roboto-Light",
        italic: "Roboto-LightItalic",
      },
      400: {
        normal: "Roboto-Regular",
        italic: "Roboto-Italic",
      },
      500: {
        normal: "Roboto-Medium",
      },
      600: {
        normal: "Roboto-Medium",
        italic: "Roboto-MediumItalic",
      },
      // Add more variants
      //   700: {
      //     normal: 'Roboto-Bold',
      //   },
      //   800: {
      //     normal: 'Roboto-Bold',
      //     italic: 'Roboto-BoldItalic',
      //   },
      //   900: {
      //     normal: 'Roboto-Bold',
      //     italic: 'Roboto-BoldItalic',
      //   },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Roboto",
    body: "Roboto",
    mono: "Roboto",
  },

  components: {
    Button: {
      // Can simply pass default props to change default behaviour of components.
      baseStyle: {
        rounded: "md",
      },
      defaultProps: {
        colorScheme: "red",
      },
    },
    Heading: {
      // Can pass also function, giving you access theming tools
      baseStyle: ({ colorMode }) => {
        return {
          color: colorMode === "dark" ? "red.300" : "blue.300",
          fontWeight: "normal",
        };
      },
    },
  },

  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: "dark",
  },
});
