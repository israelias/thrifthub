import React from 'react';

import { Platform, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  PathConfigMap,
  InitialState,
} from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { StatusBar } from 'expo-status-bar';

import { CoreNavigator } from './navigation/coreNavigator';

import VendorDataProvider from './context/vendor.context';
import ProductsDataProvider from './context/products.context';
import AuthorizationProvider from './context/authorization.context';
import { usePreference } from './context/preferences.context';
import useCachedResources from './hooks/useCachedResources';
import UserProvider from './context/user.context';

import { NAVIGATION_PERSISTENCE_KEY } from './constants/keys.constants';

import { Splash } from './components/common/splash';

import { ProductTypeParamList, RootStackParamList } from './types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const SCREENS = {
  StartScreen: { title: 'Native Stack', component: {} },
  LoginScreen: { title: 'Simple Stack', component: {} },
  RegisterScreen: {
    title: 'Modal Stack',
    component: {},
  },
  Products: {
    title: 'Regular + Modal Stack',
    component: {},
  },
  ProductDetails: {
    title: 'Float + Screen Header Stack',
    component: {},
  },
  MakeOffer: {
    title: 'Transparent Stack',
    component: {},
  },
  MakePurchase: {
    title: 'Header Customization in Stack',
    component: {},
  },
  UpdateProduct: {
    title: 'Header Customization in Native Stack',
    component: {},
  },
  Transactions: { title: 'Bottom Tabs', component: {} },
  Favorites: {
    title: 'Material Top Tabs',
    component: {},
  },
  MyProducts: {
    title: 'Material Bottom Tabs',
    component: {},
  },
  AddProduct: {
    title: 'Dynamic Tabs',
    component: {},
  },
};

export const Core = () => {
  const { theme } = usePreference();

  const isLoadingComplete = useCachedResources();

  const [isReady, setIsReady] = React.useState(
    __DEV__ ? false : true
  );
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(
            NAVIGATION_PERSISTENCE_KEY
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

  console.log('Core: Linking.getInitialUrl', Linking.getInitialURL());

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        translucent
        animated={true}
        style={theme.dark ? 'light' : 'dark'}
        backgroundColor="rgba(0, 0, 0, 0.24)"
      />

      <NavigationContainer
        initialState={initialState}
        onStateChange={(state) => {
          console.log(
            'NavigationContainer: onStateChange',
            JSON.stringify(state)
          );
          AsyncStorage.setItem(
            NAVIGATION_PERSISTENCE_KEY,
            JSON.stringify(state)
          );
        }}
        theme={theme}
        linking={{
          // To test deep linking on, run the following in the Terminal:
          // Android: adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/simple-stack"
          // iOS: xcrun simctl openurl booted exp://127.0.0.1:19000/--/simple-stack
          // Android (bare): adb shell am start -a android.intent.action.VIEW -d "rne://127.0.0.1:19000/--/simple-stack"
          // iOS (bare): xcrun simctl openurl booted rne://127.0.0.1:19000/--/simple-stack
          // The first segment of the link is the the scheme + host (returned by `Linking.makeUrl`)
          prefixes: [Linking.createURL('/')],
          enabled: true,
          config: {
            initialRouteName: 'Home',
            screens: Object.keys(SCREENS).reduce<
              PathConfigMap<RootStackParamList>
            >(
              (acc, name) => {
                // Convert screen names such as SimpleStack to kebab case (simple-stack)
                const path = name
                  .replace(/([A-Z]+)/g, '-$1')
                  .replace(/^-/, '')
                  .toLowerCase();

                console.log('CONFIG path', path);
                console.log('CONFIG namge', name);
                // @ts-expect-error: these types aren't accurate
                // But we aren't too concerned for now
                acc[name] = {
                  path,
                  screens: {
                    ProductScreen: 'products',
                    ProductDetailScreen: {
                      path: 'products/:slug?',
                      parse: {
                        slug: (slug: string) =>
                          slug.charAt(0).toUpperCase() +
                          slug.slice(1).replace(/-/g, ' '),
                      },
                      stringify: {
                        slug: (slug: string) =>
                          slug.toLowerCase().replace(/\s/g, '-'),
                      },
                    },
                    MakeOfferScreen: {
                      path: `${path}/offer/:product`,
                      parse: {
                        product: (product: ProductTypeParamList) =>
                          product.slug.charAt(0).toUpperCase() +
                          product.slug.slice(1).replace(/-/g, ' '),
                      },
                      stringify: {
                        product: (product: ProductTypeParamList) =>
                          product.slug
                            .toLowerCase()
                            .replace(/\s/g, '-'),
                      },
                    },
                    MakePurchaseScreen: {
                      path: 'products/purchase/:slug',
                      parse: {
                        slug: (slug: string) =>
                          slug.charAt(0).toUpperCase() +
                          slug.slice(1).replace(/-/g, ' '),
                      },
                      stringify: {
                        slug: (slug: string) =>
                          slug.toLowerCase().replace(/\s/g, '-'),
                      },
                    },
                    UpdateProductScreen: {
                      path: 'products/update/:slug?',
                      parse: {
                        slug: (slug: string) =>
                          slug.charAt(0).toUpperCase() +
                          slug.slice(1).replace(/-/g, ' '),
                      },
                      stringify: {
                        slug: (slug: string) =>
                          slug.toLowerCase().replace(/\s/g, '-'),
                      },
                    },
                    TransactionOrdersScreen: {
                      screens: {
                        orderRequests: {
                          path: 'transactions/sales',
                        },
                        ordersMade: {
                          path: 'transactions/purchases',
                        },
                      },
                    },
                    FavoriteProductsScreen: 'favorites',
                    MyProductsScreen: 'myproducts',
                    AddProductScreen: 'add',
                  },
                };

                return acc;
              },
              {
                Home: {
                  screens: {
                    StartScreen: '',
                    LoginScreen: 'signin',
                    RegisterScreen: 'signup',
                  },
                },
                NotFound: '*',
              }
            ),
          },
        }}
        fallback={<Text>Loading…</Text>}
        documentTitle={{
          formatter: (options, route) =>
            `${options?.title ?? route?.name} - ThriftHub`,
        }}
      >
        <ProductsDataProvider>
          <VendorDataProvider>
            <AuthorizationProvider>
              <UserProvider>
                <CoreNavigator />
              </UserProvider>
            </AuthorizationProvider>
          </VendorDataProvider>
        </ProductsDataProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};
