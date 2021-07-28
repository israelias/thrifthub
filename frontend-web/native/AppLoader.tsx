import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import React from "react";
import {
  Animated,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  ImageURISource,
} from "react-native";

import {
  DEFAULT_ADAPTIVE_ICON,
  MOBILE_SPLASHSCREEN,
} from "../src/constants/backend.constants";

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function AppLoader({
  children,
}: {
  children?: React.ReactNode;
}) {
  const splash = Constants?.manifest?.splash?.image || MOBILE_SPLASHSCREEN;
  return (
    <AnimatedAppLoader image={{ uri: splash }}>{children}</AnimatedAppLoader>
  );
}

export function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: ImageURISource;
}) {
  const [isSplashReady, setSplashReady] = React.useState(false);

  // const startAsync = React.useMemo(
  //   // If you use a local image with require(...), use `Asset.fromModule`
  //   () => () =>
  //   {
  //     const splashScreen = Asset.fromURI(MOBILE_SPLASHSCREEN).downloadAsync();
  //     return splashScreen
  //   }
  //   []
  // );

  const startAsync = React.useMemo(
    // If you use a local image with require(...), use `Asset.fromModule`
    () => () => Asset.fromURI(image.toString()).downloadAsync(),
    [image]
  );

  const onFinish = React.useMemo(() => setSplashReady(true), []);

  if (!isSplashReady) {
    return (
      <AppLoading
        // Instruct SplashScreen not to hide yet, we want to do this manually
        autoHideSplash={false}
        // startAsync={async () => {
        //   Asset.fromURI(MOBILE_SPLASHSCREEN).downloadAsync();
        // }}
        startAsync={async () => {
          startAsync;
        }}
        onError={console.error}
        onFinish={() => onFinish}
      />
    );
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({
  children,
  image,
}: {
  children: React.ReactNode;
  image: ImageURISource;
}) {
  const animation = React.useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = React.useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] =
    React.useState(false);

  React.useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = React.useMemo(
    () => async () => {
      try {
        await SplashScreen.hideAsync();
        // Load stuff
        await Promise.all([]);
      } catch (e) {
        // handle errors
      } finally {
        setAppReady(true);
      }
    },
    []
  );

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants?.manifest?.splash?.backgroundColor,
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants?.manifest?.splash?.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}
