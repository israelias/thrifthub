/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Store: {
            screens: {
              ProductScreen: 'store',
              TransactionOrdersScreen: 'orders',
              FavoriteProductsScreen: 'favorites',
              VendorProductsScreen: 'myproducts',
              AddProductScreen: 'add',
            },
          },
          ProductDetailScreen: {
            path: 'products/:slug',
            parse: {
              slug: String,
            },
          },
          MakeOfferScreen: {
            path: 'order/:id',
            parse: {
              id: String,
            },
          },
          MakePurchaseScreen: {
            path: 'order/:id',
            parse: {
              id: String,
            },
          },
        },
      },
      Account: {
        screens: {
          StartScreen: {
            path: 'account',
          },
          RegisterScreen: {
            path: 'account/register',
          },
          LoginScreen: {
            path: 'account/login',
          },
        },
      },
      NotFound: '*',
    },
  },
};
