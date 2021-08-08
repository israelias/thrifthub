import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';

import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { Appbar, Avatar, useTheme } from 'react-native-paper';

import * as ROUTES from '../constants/routes.constants';

import { useVendorIcon } from '../hooks/useVendorIcon';
import { ProductDetailScreen } from '../screens/products/productDetailScreen';
import { MakeOfferScreen } from '../screens/products/newMakeOfferScreen';
import { MakePurchaseScreen } from '../screens/products/makePurchaseScreen';
import { UpdateProductScreen } from '../screens/products/updateProductScreen';
import { ProductStackNavigatorParamList } from '../types';
import { BottomTabs } from './bottomTabNavigator';

const Stack = createStackNavigator<ProductStackNavigatorParamList>();

export const StackNavigator = () => {
  const theme = useTheme();

  const { vendorInitials, vendorIcon } = useVendorIcon();

  const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;

  const handleSearch = () => console.log('Searching');

  React.useEffect(() => {
    console.log('ProductStackNavigator', Stack);
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Products"
      screenOptions={{
        animationEnabled: true,

        header: ({ navigation, route, options, back }) => {
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
              {back ? (
                <Appbar.BackAction
                  onPress={navigation.goBack}
                  color={theme.colors.primary}
                />
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    (
                      navigation as any as DrawerNavigationProp<{}>
                    ).openDrawer();
                  }}
                >
                  {vendorIcon ? (
                    <Avatar.Image
                      size={40}
                      source={{
                        uri: vendorIcon,
                      }}
                    />
                  ) : vendorInitials ? (
                    <Avatar.Text size={40} label={vendorInitials} />
                  ) : (
                    <Avatar.Icon size={40} icon="account" />
                  )}
                </TouchableOpacity>
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
                onPress={handleSearch}
              />
            </Appbar.Header>
          );
        },
      }}
    >
      <Stack.Screen
        name="Products"
        component={BottomTabs}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'Store';
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name={ROUTES.PRODUCT_DETAILS_ROUTE}
        component={ProductDetailScreen}
        options={{ headerTitle: 'Product Details' }}
      />
      <Stack.Screen
        name={ROUTES.MAKE_OFFER_ROUTE}
        component={MakeOfferScreen}
        options={{ headerTitle: 'Make Offer' }}
      />
      <Stack.Screen
        name={ROUTES.MAKE_PURCHASE_ROUTE}
        component={MakePurchaseScreen}
        options={{ headerTitle: 'Make Purchase' }}
      />
      <Stack.Screen
        name={ROUTES.UPDATE_PRODUCT_ROUTE}
        component={UpdateProductScreen}
        options={{ headerTitle: 'Update Product' }}
      />
    </Stack.Navigator>
  );
};
