import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { useTheme } from 'react-native-paper';

import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from '../components/common/theme';
import {
  AuthStateInterface,
  useAuth,
} from '../context/authorization.context';
import { stateConditionString } from '../context/authUtils';
import UserProvider from '../context/user.context';
import {
  Dashboard,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  StartScreen,
} from '../screens/account';

import { ProductDetailScreen } from '../screens/products/productDetailScreen';
import { DrawerContent } from '../screens/vendor/drawerContent';
import { AuthStackNavigationParamList } from '../types';
import { AccountStackNavigator } from './accountStackNavigator';
import { DrawerNavigator } from './drawerNavigator';
import { StackNavigator } from './productStackNavigator';

export const CoreNavigator = () => {
  const { state } = useAuth();
  const {
    isLoading,
    isSignedIn,
    accessToken,
    noAccount,
    isSignedUp,
  } = useAuth();

  console.log('Core: isSignedIn', isSignedIn);
  console.log('Core: isLoading', isLoading);
  console.log('Core: accessToken', accessToken);
  console.log('Core: noAccount', noAccount);
  console.log('Core: isSignedUp', isSignedUp);

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

  // const chooseScreen = (state: AuthStateInterface) => {
  //   let navigateTo = stateConditionString(state);
  //   let arr = [];

  //   switch (navigateTo) {
  //     case 'LOAD_APP':
  //       arr.push(
  //         <RootStack.Screen
  //           name="SplashScreen"
  //           component={StartScreen}
  //         />
  //       );
  //       break;

  //     case 'LOAD_SIGNUP':
  //       arr.push(
  //         <RootStack.Screen
  //           name="SignUpScreen"
  //           component={RegisterScreen}
  //           options={{
  //             title: 'Sign Up',
  //             animationTypeForReplace: state.isSignedOut
  //               ? 'pop'
  //               : 'push',
  //           }}
  //         />
  //       );
  //       break;
  //     case 'LOAD_SIGNIN':
  //       arr.push(
  //         <RootStack.Screen name="SignInScreen" component={SignIn} />
  //       );
  //       break;

  //     case 'LOAD_HOME':
  //       arr.push(
  //         <RootStack.Screen
  //           name="HomeScreen"
  //           component={DrawerNavigator}
  //         />
  //       );
  //       break;
  //     default:
  //       arr.push(
  //         <RootStack.Screen name="SignInScreen" component={SignIn} />
  //       );
  //       break;
  //   }
  //   return arr[0];
  // };

  return (
    <>
      <>
        <>
          {state.isSignedIn ? (
            <DrawerNavigator />
          ) : (
            <AccountStackNavigator />
          )}
        </>
      </>
      {/* <RootStack.Navigator>
          {chooseScreen(state)}
        </RootStack.Navigator> */}
    </>
  );
};
