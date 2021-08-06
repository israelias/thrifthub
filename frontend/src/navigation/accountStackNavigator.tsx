import React from 'react';
import color from 'color';

import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Appbar, Avatar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { TouchableOpacity } from 'react-native';
import {
  DEFAULT_AVATAR,
  DEFAULT_ICON,
} from '../constants/backend.constants';

import * as ROUTES from '../constants/routes.constants';

import overlay from '../utils/overlay';

import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
} from '../screens/account';

import { useAuth } from '../context/authorization.context';

import { AccountStackNavigatorParamList } from '../types';

const AccountStack =
  createStackNavigator<AccountStackNavigatorParamList>();

export const AccountStackNavigator = () => {
  const theme = useTheme();
  const { state } = useAuth();
  // const {
  //   isLoading,
  //   isSignedIn,
  //   accessToken,
  //   noAccount,
  //   isSignedUp,
  // } = useAuth();

  // console.log('isSignedIn', isSignedIn);
  // console.log('isLoading', isLoading);
  // console.log('accessToken', accessToken);
  // console.log('noAccount', noAccount);
  // console.log('isSignedUp', isSignedUp);

  // React.useEffect(() => {
  //   if (isLoading) {
  //     navigation.replace('Dashboard');
  //   }
  //   if (isSignedIn && accessToken && isSignedUp) {
  //     console.log('isSignedIn and accessToken and isSignedUp');
  //     navigation.replace('LoginScreen');
  //   }
  //   if (!isSignedUp && noAccount) {
  //     console.log('not isSignedUp and noAccount');
  //     navigation.replace('RegisterScreen');
  //   }
  //   if (!isSignedIn && !noAccount) {
  //     console.log('not isSignedIn and not noAccount');
  //     navigation.replace('LoginScreen');
  //   }
  // }, [isSignedIn, accessToken, isSignedUp, noAccount, isLoading]);

  console.log('AccountStackNavigator', AccountStack);

  return (
    <AccountStack.Navigator
      initialRouteName={ROUTES.START_ROUTE}
      // headerMode="screen"
      screenOptions={{
        headerShown: true,
        animationEnabled: true,
        cardOverlayEnabled: true,
        cardShadowEnabled: true,
        animationTypeForReplace: 'push',
        header: ({ navigation, route, back, options }) => {
          // const { options } = scene.descriptor;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : route.name;

          return (
            <Appbar.Header
              theme={{
                colors: {
                  primary: theme.dark
                    ? (overlay(6, theme.colors.surface) as string)
                    : theme.colors.surface,
                },
              }}
            >
              {back ? (
                <Appbar.BackAction
                  onPress={navigation.goBack}
                  color={theme.colors.primary}
                />
              ) : (
                <Avatar.Image
                  size={40}
                  style={{ backgroundColor: 'transparent' }}
                  source={require('../assets/logo.png')}
                />
              )}

              <Appbar.Content
                title={
                  title === ROUTES.START_ROUTE ? (
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
            </Appbar.Header>
          );
        },
      }}
    >
      <AccountStack.Screen
        name={ROUTES.START_ROUTE}
        component={StartScreen}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'StartScreen';
          return { headerTitle: routeName };
        }}
      />
      <AccountStack.Screen
        name={ROUTES.SIGNIN_ROUTE}
        component={LoginScreen}
        options={{ headerTitle: 'Sign In' }}
      />
      <AccountStack.Screen
        name={ROUTES.SIGNUP_ROUTE}
        component={RegisterScreen}
        options={{
          headerTitle: 'Register',
          animationTypeForReplace: state.isSignedOut ? 'pop' : 'push',
        }}
      />
    </AccountStack.Navigator>
  );
};
