import React from 'react';

import { Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { StatusBar } from 'expo-status-bar';

import { CoreNavigator } from './navigation/coreNavigator';

import VendorDataProvider from './context/vendor.context';
import ProductsDataProvider from './context/products.context';
import AuthorizationProvider from './context/authorization.context';
import { usePreference } from './context/preferences.context';
import useCachedResources from './hooks/useCachedResources';
import UserProvider from './context/user.context';

import { Splash } from './components/common/splash';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export const Core = () => {
  const { isThemeDark, theme } = usePreference();

  const isLoadingComplete = useCachedResources();

  const [isReady, setIsReady] = React.useState(
    __DEV__ ? false : true
  );
  const [initialState, setInitialState] = React.useState();

  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(
            PERSISTENCE_KEY
          );
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    if (!isReady || !isLoadingComplete)
      setTimeout(() => {
        setShowSplash(false);
      }, 7000);
  }, []);

  // if (!isReady || !isLoadingComplete) {
  //   return <Splash />;
  // }

  if (showSplash) {
    return <Splash isVisible={!isReady || !isLoadingComplete} />;
  }

  // let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  // const onReady = ((
  //   isReadyRef as React.MutableRefObject<boolean>
  // ).current = true);

  // console.log('onReady', onReady);

  // React.useEffect(() => {
  //   return () => {
  //     (isReadyRef as React.MutableRefObject<boolean>).current = false;
  //   };
  // }, []);

  // React.useEffect(() => {
  //   console.log(
  //     'NavigationContainerRef: getRootState',
  //     navigationRef?.current?.getRootState()
  //   );
  //   console.log(
  //     'NavigationContainerRef: getCurrentRoute',
  //     navigationRef?.current?.getCurrentRoute()
  //   );
  //   console.log(
  //     'NavigationContainerRef: getCurrentOptions',
  //     navigationRef?.current?.getCurrentOptions()
  //   );
  // }, [navigationRef]);

  console.log('Core: Linking.getInitialUrl', Linking.getInitialURL());

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        console.log(
          'NavigationContainer: onStateChange',
          JSON.stringify(state)
        );
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
      }}
      documentTitle={{
        formatter: (options, route) =>
          `${options?.title ?? route?.name} - ThriftHub`,
      }}
      theme={theme}
      linking={{
        prefixes: [Linking.makeUrl('/')],
        enabled: true,
        config: {
          screens: {
            Store: {
              screens: {
                Products: {
                  screens: {
                    ProductScreen: 'products',
                    ProductDetailScreen: {
                      path: 'products/:slug',
                      parse: {
                        slug: String,
                      },
                    },
                  },
                },
                Transactions: {
                  screens: {
                    TransactionOrdersScreen: 'two',
                  },
                },
                // Products: {
                //   path: 'products/:slug',
                //   parse: {
                //     slug: String,
                //   },
                // },
              },
            },
            NotFound: '*',
          },
        },
      }}
    >
      <>
        <PaperProvider theme={theme}>
          <StatusBar
            animated={true}
            style={isThemeDark ? 'light' : 'dark'}
          />
          <ProductsDataProvider>
            <VendorDataProvider>
              <AuthorizationProvider>
                <>
                  <>
                    <UserProvider>
                      <CoreNavigator />
                    </UserProvider>
                  </>
                </>
              </AuthorizationProvider>
            </VendorDataProvider>
          </ProductsDataProvider>
        </PaperProvider>
      </>
    </NavigationContainer>
  );
};
