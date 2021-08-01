import React from 'react';
import color from 'color';
import { Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import {
  TabView,
  SceneMap,
  TabBar,
  TabBarProps,
} from 'react-native-tab-view';

import overlay from '../../utils/overlay';

import { OrdersMadeScreen } from './ordersMadeScreen';
import { OrderRequestsScreen } from './orderRequestsScreen';

const initialLayout = { width: Dimensions.get('window').width };

const OrderRequests = () => <OrderRequestsScreen />;

const OrdersMade = () => <OrdersMadeScreen />;

export const TransactionOrdersScreen = () => {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'orderRequests', title: 'Sales' },
    { key: 'ordersMade', title: 'Purchases' },
  ]);

  const theme = useTheme();

  const renderScene = SceneMap({
    orderRequests: OrderRequests,
    ordersMade: OrdersMade,
  });

  const tabBarColor = theme.dark
    ? (overlay(4, theme.colors.surface) as string)
    : theme.colors.surface;

  const textColor = theme.dark
    ? (overlay(4, theme.colors.text) as string)
    : theme.colors.text;

  const rippleColor = theme.dark
    ? color(tabBarColor).lighten(0.5)
    : color(tabBarColor).darken(0.2);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{
        color: textColor,
        backgroundColor: tabBarColor,
        shadowColor: theme.colors.text,
      }}
      labelStyle={{ color: theme.colors.primary }}
      pressColor={rippleColor}
    />
  );

  return (
    <React.Fragment>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </React.Fragment>
  );
};
