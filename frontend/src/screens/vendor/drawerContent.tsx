import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerNavigationProp,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  getFocusedRouteNameFromRoute,
  DrawerActions,
  StackActions,
  ParamListBase,
} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
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
import { usePreference } from '../../context/preferences.context';

import { useVendorData } from '../../context/vendor.context';
import { useVendorIcon } from '../../hooks/useVendorIcon';
import { useAuth } from '../../context/authorization.context';

type Props = DrawerContentComponentProps<DrawerContentOptions>;

export function DrawerContent(props: Props) {
  const { vendor } = useVendorData();
  const { signOut, isSignedOut } = useAuth();
  const { vendorIcon, vendorInitials } = useVendorIcon();

  const paperTheme = useTheme();
  const { rtl, theme, isThemeDark, toggleRTL, toggleTheme } =
    usePreference();

  const translateX = Animated.interpolateNode(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  console.log('Drawer: state', props.state);
  console.log('Drawer: state routes', props.state.routes);
  console.log('Drawer: state routenames', props.state.routeNames);
  console.log('Drawer: navigation', props.navigation);

  function getCurrentRouteName() {
    let routes = props.state.routeNames;

    console.log('DrawerContent: routes', routes);
    // let tempRoute =
    //   getFocusedRouteNameFromRoute(props.navigation.isFocused) ?? 'Store';
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
                color={color}
                size={size}
              />
            )}
            label="My Products"
            onPress={() => {
              console.log('Drawer: pushed My Products');

              navigationWithPush('Products', {
                screen: 'My Products',
                params: {
                  screen: 'My Products',
                },
              });
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={ICONS.TRANSACTIONS_ICON}
                color={color}
                size={size}
              />
            )}
            label="Transactions"
            onPress={() => {
              console.log('Drawer: pushed Transactions');

              navigationWithPush('Products', {
                screen: 'Transactions',
              });
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={ICONS.FAVORITES_ICON}
                color={color}
                size={size}
              />
            )}
            label="Favorites"
            onPress={() => {
              console.log('Drawer: pushed Favorites');
              navigationWithPush('Products', {
                screen: 'Favorites',
              });
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={ICONS.PRODUCTS_ICON}
                color={color}
                size={size}
              />
            )}
            label="All Products"
            onPress={() => {
              console.log('Drawer: pushed All Products');

              navigationWithPush('Products');
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name={ICONS.ADD_PRODUCT_ICON}
                color={color}
                size={size}
              />
            )}
            label="Add Product"
            onPress={() => {
              console.log('Drawer: pushed Favorites');
              navigationWithPush('Products', {
                screen: 'Add Product',
              });
            }}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={isThemeDark} />
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
