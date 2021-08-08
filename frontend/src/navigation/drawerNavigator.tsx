import React from 'react';
import { useWindowDimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme, Button, Appbar } from 'react-native-paper';

import { ProductScreen } from '../screens/products/productScreen';
import { ProductDetailScreen } from '../screens/products/productDetailScreen';
import { MakeOfferScreen } from '../screens/products/newMakeOfferScreen';
import { MakePurchaseScreen } from '../screens/products/makePurchaseScreen';
import { UpdateProductScreen } from '../screens/products/updateProductScreen';

import { TransactionOrdersScreen } from '../screens/orders/ordersScreen';
import { AddProductScreen } from '../screens/vendor/newAddProductScreen';
import { MyProductsScreen } from '../screens/vendor/myProductsScreen';
import { FavoriteProductsScreen } from '../screens/vendor/favoritesScreen';

import * as ICONS from '../constants/icons.constants';
import * as ROUTES from '../constants/routes.constants';

import { StackNavigator } from './productStackNavigator';

import { DrawerContent } from '../screens/vendor/drawerContent';

import { DrawerStackParamList } from '../types';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

export const DrawerNavigator = () => {
  const theme = useTheme();

  // const translateX = Animated.interpolateNode(props.progress, {
  //   inputRange: [0, 0.5, 0.7, 0.8, 1],
  //   outputRange: [-100, -85, -70, -45, 0],
  // });
  const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;

  return (
    <Drawer.Navigator
      // useLegacyImplementation={true}
      // drawerType={isLargeScreen ? 'permanent' : 'front'}

      screenOptions={{
        headerShown: isLargeScreen,
        drawerType: isLargeScreen ? 'permanent' : 'front',
        sceneContainerStyle: {},
        // drawerLabel: ({ focused, color }) => (

        // )
        drawerLabelStyle: { fontFamily: 'space-mono' },
        // labelStyle: {}
        // drawerStyle: isLargeScreen ? null : { width: '100%' },
        // overlayColor: theme.colors.background,
        header: ({ navigation, route, options }) => {
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : route.name;
          return (
            <Appbar.Header
              theme={{ colors: { primary: theme.colors.surface } }}
            >
              {route.name !== title ? (
                <Appbar.BackAction
                  onPress={navigation.goBack}
                  color={theme.colors.primary}
                />
              ) : (
                'Hello'
              )}
              <Appbar.Content
                title={
                  title === 'Store' ? (
                    <MaterialCommunityIcons
                      style={{ marginRight: 10 }}
                      name="package-variant-closed"
                      size={40}
                      color={theme.colors.primary}
                    />
                  ) : (
                    title
                  )
                }
                titleStyle={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: theme.colors.primary,
                }}
              />
              <Appbar.Action
                icon={() => (
                  <MaterialCommunityIcons
                    name="magnify"
                    size={30}
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => {}}
              />
            </Appbar.Header>
          );
        },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      {isLargeScreen ? (
        <React.Fragment>
          <Drawer.Screen
            name={ROUTES.PRODUCTS_ROUTE}
            component={ProductScreen}
            options={{
              headerTitle: 'Product',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.PRODUCTS_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={ROUTES.PRODUCT_DETAILS_ROUTE}
            component={(props) => (
              <ScrollView>
                <ProductDetailScreen {...props} />
              </ScrollView>
            )}
            options={{
              headerTitle: 'Product Details',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.PRODUCT_DETAILS_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={ROUTES.MAKE_OFFER_ROUTE}
            component={MakeOfferScreen}
            options={{
              headerTitle: 'Make Offer',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.MAKE_OFFER_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={ROUTES.MAKE_PURCHASE_ROUTE}
            component={MakePurchaseScreen}
            options={{
              headerTitle: 'Make Purchase',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.MAKE_PURCHASE_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={ROUTES.UPDATE_PRODUCT_ROUTE}
            component={UpdateProductScreen}
            options={{
              headerTitle: 'Update Product',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.UPDATE_PRODUCT_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={ROUTES.TRANSACTIONS_ROUTE}
            component={TransactionOrdersScreen}
            options={{
              headerTitle: 'Transactions',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.TRANSACTIONS_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={ROUTES.FAVORITES_ROUTE}
            component={FavoriteProductsScreen}
            options={{
              headerTitle: 'Favorites',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.FAVORITES_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={ROUTES.MY_PRODUCTS_ROUTE}
            component={MyProductsScreen}
            options={{
              headerTitle: 'My Products',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.MY_PRODUCTS_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
          <Drawer.Screen
            name={ROUTES.ADD_PRODUCT_ROUTE}
            component={AddProductScreen}
            options={{
              headerTitle: 'Add Product',
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name={ICONS.ADD_PRODUCT_ICON}
                  size={40}
                  color={theme.colors.primary}
                />
              ),
            }}
          />
        </React.Fragment>
      ) : (
        <Drawer.Screen name="Home" component={StackNavigator} />
      )}
    </Drawer.Navigator>
  );
};
