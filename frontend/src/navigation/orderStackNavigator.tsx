import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { Appbar, Avatar, useTheme } from 'react-native-paper';

import { OrdersMadeScreen } from '../screens/orders/ordersMadeScreen';
import { OrderRequestsScreen } from '../screens/orders/orderRequestsScreen';
import { OrderTransactionStackParamList } from '../types';

const Stack = createStackNavigator<OrderTransactionStackParamList>();

export const OrderStackNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Order"
      // headerMode="screen"
    >
      <Stack.Screen
        name="Order"
        component={OrderRequestsScreen}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'Order';
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderRequestsScreen}
        options={{ headerTitle: 'Order Details' }}
      />
    </Stack.Navigator>
  );
};
