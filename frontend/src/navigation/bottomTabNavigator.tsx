import React from 'react';
import color from 'color';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useIsFocused,
  RouteProp,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';

import * as ROUTES from '../constants/routes.constants';
import * as ICONS from '../constants/icons.constants';

import { ProductScreen } from '../screens/products/productScreen';
import { FavoriteProductsScreen } from '../screens/vendor/favoritesScreen';
import { TransactionOrdersScreen } from '../screens/orders/ordersScreen';

import { AddProductScreen } from '../screens/vendor/newAddProductScreen';
import { MyProductsScreen } from '../screens/vendor/myProductsScreen';

import {
  OrderTransactionStackParamList,
  ProductStackNavigatorParamList,
} from '../types';

import overlay from '../utils/overlay';

import { useAuth } from '../context/authorization.context';

const Tab = createMaterialBottomTabNavigator();

type OrderProps = {
  route: RouteProp<OrderTransactionStackParamList, 'Order'>;
};
type Props = {
  route: RouteProp<ProductStackNavigatorParamList, 'Products'>;
};

export const BottomTabs = (props: Props) => {
  const routeName =
    getFocusedRouteNameFromRoute(props.route) ?? 'Store';

  const { state } = useAuth();

  const theme = useTheme();
  const safeArea = useSafeAreaInsets();
  const isFocused = useIsFocused();

  let icon = 'feather';

  switch (routeName) {
    case ROUTES.PRODUCTS_ROUTE:
      icon = ICONS.PRODUCTS_ICON;
      break;
    case ROUTES.TRANSACTIONS_ROUTE:
      icon = ICONS.TRANSACTIONS_ICON;
      break;
    case ROUTES.FAVORITES_ROUTE:
      icon = ICONS.FAVORITES_ICON;
      break;
    case ROUTES.MY_PRODUCTS_ROUTE:
      icon = ICONS.MY_PRODUCTS_ICON;
      break;
    case ROUTES.ADD_PRODUCT_ROUTE:
      icon = ICONS.ADD_PRODUCT_ICON;
      break;
    default:
      icon = 'feather';
      break;
  }

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface;

  React.useEffect(() => {
    console.log('Bottom Tabs: route', props.route);
  }, [props]);

  React.useEffect(() => {
    console.log('BottomTab Navigator', Tab);
  }, []);

  console.log('BottomTabs: tabBarColor', tabBarColor);

  return (
    <React.Fragment>
      <React.Fragment>
        <Tab.Navigator
          initialRouteName="Store"
          backBehavior="initialRoute"
          shifting={true}
          activeColor={theme.colors.primary}
          inactiveColor={color(theme.colors.text)
            .alpha(0.6)
            .rgb()
            .string()}
          sceneAnimationEnabled={false}
          barStyle={{
            backgroundColor: theme.dark
              ? (overlay(6, theme.colors.surface) as string)
              : theme.colors.surface,
          }}
        >
          <Tab.Screen
            name={ROUTES.PRODUCTS_ROUTE}
            component={ProductScreen}
            options={{
              tabBarIcon: ICONS.PRODUCTS_ICON,
              tabBarColor,
            }}
          />
          <Tab.Screen
            name={ROUTES.TRANSACTIONS_ROUTE}
            component={TransactionOrdersScreen}
            options={{
              tabBarIcon: ICONS.TRANSACTIONS_ICON,
              tabBarColor,
            }}
          />
          <Tab.Screen
            name={ROUTES.FAVORITES_ROUTE}
            component={FavoriteProductsScreen}
            options={{
              tabBarIcon: ICONS.FAVORITES_ICON,
              tabBarColor,
            }}
          />
          <Tab.Screen
            name={ROUTES.MY_PRODUCTS_ROUTE}
            component={MyProductsScreen}
            options={{
              tabBarIcon: ICONS.MY_PRODUCTS_ICON,
              tabBarColor,
            }}
          />
          <Tab.Screen
            name={ROUTES.ADD_PRODUCT_ROUTE}
            component={AddProductScreen}
            options={{
              tabBarIcon: ICONS.ADD_PRODUCT_ICON,
              tabBarColor,
            }}
          />
        </Tab.Navigator>
        <Portal>
          <FAB
            visible={isFocused}
            icon={icon}
            style={{
              position: 'absolute',
              bottom: safeArea.bottom + 65,
              right: 16,
            }}
            color="white"
            theme={{
              colors: {
                accent: theme.colors.primary,
              },
            }}
            onPress={() => {}}
          />
        </Portal>
      </React.Fragment>
    </React.Fragment>
  );
};
