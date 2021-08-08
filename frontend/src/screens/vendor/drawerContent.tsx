import React from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import color from 'color';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  useDrawerProgress,
} from '@react-navigation/drawer';

import {
  DrawerActions,
  StackActions,
} from '@react-navigation/native';

import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollViewProps,
  View,
} from 'react-native';

import {
  Avatar,
  Caption,
  Drawer,
  Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
  Button,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';

import * as ICONS from '../../constants/icons.constants';
import * as ROUTES from '../../constants/routes.constants';

import { usePreference } from '../../context/preferences.context';
import { useVendorData } from '../../context/vendor.context';
import { useVendorIcon } from '../../hooks/useVendorIcon';
import { useAuth } from '../../context/authorization.context';

type Props = DrawerContentComponentProps;

export function DrawerContent(props: Props) {
  const { vendor } = useVendorData();
  const { signOut, isSignedOut } = useAuth();
  const { vendorIcon, vendorInitials } = useVendorIcon();

  const paperTheme = useTheme();
  const { rtl, theme, isThemeDark, toggleRTL, toggleTheme } =
    usePreference();

  const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;

  const progress = useDrawerProgress();

  const translateX = Animated.interpolateNode(
    // @ts-ignore
    progress,
    {
      inputRange: [0, 0.5, 0.7, 0.8, 1],
      outputRange: [-100, -85, -70, -45, 0],
    }
  );

  const { state } = props;
  const { routes, index } = state;
  const focusedRoute = routes[index].name;

  const activeColor = theme.colors.primary;

  const inactiveColor = color(theme.colors.text)
    .alpha(0.6)
    .rgb()
    .string();

  console.log('Drawer: state focused route', focusedRoute);
  console.log('Drawer: state', props.state);
  console.log('Drawer: state routes', props.state.routes);
  console.log('Drawer: state routenames', props.state.routeNames);
  console.log('Drawer: navigation', props.navigation);

  function getCurrentRouteName() {
    let routes = props.state.routeNames;

    console.log('DrawerContent: routes', routes);

    let route = routes[routes.length - 1];
    console.log('DrawerContent: route', route);
    if (route.length > 0) {
      console.log(
        'DrawerContent: route.length > 0',
        route.length > 0
      );
      console.log(
        'DrawerContent: return rout[route.length - 1]',
        route[route.length - 1]
      );
      return route[route.length - 1];
    }
    return null;
  }

  const navigationWithPush = (
    routeName: string,
    params?: object | undefined
  ) => {
    let currentRoute;

    /**
     **  get route of current screen from the navigation props
     **/
    if (
      Object.keys(props.state).length > 0 &&
      props.state.routes != undefined
    ) {
      console.log(
        'DrawerContent: navigationWithPush: if props.state.length > 0'
      );
      currentRoute = getCurrentRouteName();
      console.log(
        'DrawerContent: navigationWithPush: currentRoute = getCurrentRouteName',
        currentRoute
      );
      console.log(
        'DrawerContent: navigationWithPush: value of getCurrentRouteName',
        getCurrentRouteName()
      );
    }

    /**
     ** if current route is the routeName itself then just close the drawer, else
     ** push routeName to navigation state by dispatching the StackActions
     **/

    if (currentRoute === routeName) {
      console.log(
        'DrawerContent: navigationWithPush: currentRoute === routeName'
      );
      console.log(
        'DrawerContent: navigationWithPush: currentroute:',
        currentRoute
      );
      console.log(
        'DrawerContent: navigationWithPush: routeName',
        routeName
      );
      props.navigation.dispatch(DrawerActions.closeDrawer());
    } else {
      console.log(
        'DrawerContent: navigationWithPush: currentRoute is not equal to routeName'
      );
      console.log(
        'DrawerContent: navigationWithPush: currentroute:',
        currentRoute
      );
      console.log(
        'DrawerContent: navigationWithPush: routeName',
        routeName
      );
      const pushAction = StackActions.push(routeName, params);
      props.navigation.closeDrawer();
      props.navigation.dispatch(pushAction);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View
        //@ts-ignore
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              props.navigation.toggleDrawer();
            }}
          >
            {vendorIcon ? (
              <Avatar.Image
                size={40}
                style={{ marginRight: 10 }}
                source={{
                  uri: vendorIcon,
                }}
              />
            ) : vendorInitials ? (
              <Avatar.Text size={50} label={vendorInitials} />
            ) : (
              <Avatar.Icon size={50} icon="account" />
            )}
          </TouchableOpacity>
          <Title style={styles.title}>
            {vendor?.name ? vendor.name : 'Dawid'}
          </Title>
          <Caption style={styles.caption}>
            {vendor?.online ? 'Online' : 'Offline'}
          </Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {vendor?.product_count || 'failed to fetch'}
              </Paragraph>
              <Caption style={styles.caption}>Products</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {vendor?.order_count || 'failed to fetch'}
              </Paragraph>
              <Caption style={styles.caption}>Transactions</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={ICONS.MY_PRODUCTS_ICON}
                color={
                  focusedRoute === ROUTES.MY_PRODUCTS_ROUTE
                    ? activeColor
                    : inactiveColor
                }
                size={size}
              />
            )}
            label="My Products"
            onPress={() => {
              isLargeScreen
                ? props.navigation.navigate(ROUTES.MY_PRODUCTS_ROUTE)
                : navigationWithPush('Products', {
                    screen: ROUTES.MY_PRODUCTS_ROUTE,
                  });
            }}
          />
          <DrawerItem
            activeTintColor={activeColor}
            inactiveTintColor={inactiveColor}
            icon={({ color, focused, size }) => (
              <MaterialCommunityIcons
                name={ICONS.TRANSACTIONS_ICON}
                color={
                  focusedRoute === ROUTES.TRANSACTIONS_ROUTE
                    ? activeColor
                    : inactiveColor
                }
                size={size}
              />
            )}
            label="Transactions"
            onPress={() => {
              console.log('Drawer: pushed Transactions');
              isLargeScreen
                ? props.navigation.navigate(ROUTES.TRANSACTIONS_ROUTE)
                : navigationWithPush('Products', {
                    screen: ROUTES.TRANSACTIONS_ROUTE,
                  });
            }}
          />
          <DrawerItem
            activeTintColor={activeColor}
            inactiveTintColor={inactiveColor}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={ICONS.FAVORITES_ICON}
                color={
                  focusedRoute === ROUTES.FAVORITES_ROUTE
                    ? activeColor
                    : inactiveColor
                }
                size={size}
              />
            )}
            label="Favorites"
            onPress={() => {
              console.log('Drawer: pushed Favorites');
              isLargeScreen
                ? props.navigation.navigate(ROUTES.FAVORITES_ROUTE)
                : navigationWithPush('Products', {
                    screen: ROUTES.FAVORITES_ROUTE,
                  });
            }}
          />
          <DrawerItem
            activeTintColor={activeColor}
            inactiveTintColor={inactiveColor}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={ICONS.PRODUCTS_ICON}
                color={
                  focusedRoute === ROUTES.PRODUCTS_ROUTE
                    ? activeColor
                    : inactiveColor
                }
                size={size}
              />
            )}
            label="All Products"
            onPress={() => {
              console.log('Drawer: pushed All Products');
              isLargeScreen
                ? props.navigation.navigate(ROUTES.PRODUCTS_ROUTE)
                : navigationWithPush('Products');
            }}
          />
          <DrawerItem
            activeTintColor={activeColor}
            inactiveTintColor={inactiveColor}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={ICONS.ADD_PRODUCT_ICON}
                color={
                  focusedRoute === ROUTES.ADD_PRODUCT_ROUTE
                    ? activeColor
                    : inactiveColor
                }
                size={size}
              />
            )}
            label="Add Product"
            onPress={() => {
              console.log('Drawer: pushed Add Product');
              isLargeScreen
                ? props.navigation.navigate(ROUTES.ADD_PRODUCT_ROUTE)
                : navigationWithPush('Products', {
                    screen: ROUTES.ADD_PRODUCT_ROUTE,
                  });
            }}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={theme.dark} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={toggleRTL}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={rtl === 'right'} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
        <Drawer.Section title="Account">
          <TouchableRipple onPress={() => signOut()}>
            <View style={styles.preference}>
              <Text>Sign Out</Text>
              <View pointerEvents="none">
                <Switch value={isSignedOut === false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
