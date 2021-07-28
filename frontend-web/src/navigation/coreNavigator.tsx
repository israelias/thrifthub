import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";
import { StackNavigator } from "./productStackNavigator";
import { AccountStackNavigator } from "./accountStackNavigator";
import { DrawerContent } from "../screens/vendor/drawerContent";

import { DrawerNavigator } from "./drawerNavigator";
import { SignIn } from "../components/account/accounSign";
import { SignUpScreen } from "../screens/account/signUpScreen";
import { SplashScreen } from "../screens/account/splashScreen";

import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from "../components/common/theme";

import {
  navigationRef,
  isReadyRef,
  // setTopLevelNavigator,
} from "./rootNavigator";

import { AuthStackNavigationParamList } from "../types";

import UserProvider from "../context/user.context";
import AuthProvider, { useAuth } from "../context/auth.context";
import AuthorizationProvider from "../context/authorization.context";

import {
  stateConditionString,
  AuthStateInterface,
  AuthContext,
} from "../context/authUtils";

const Stack = createStackNavigator<AuthStackNavigationParamList>();
const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

export const CoreNavigator = () => {
  const { state } = React.useContext(AuthContext);
  // setTopLevelNavigator()
  // const isReady = React.useRef(isReadyRef);
  // const [readyState, setReadyState] = React.useState(false);
  // const { state } = useAuth();

  // const { accessToken, loading, isSignOut } = state;

  // React.useEffect(() => {
  //   if (state) {
  //     setReadyState(true);
  //   }
  // }, [state]);

  // const chooseScreen = (state: AuthStateInterface) => {
  //   let navigateTo = stateConditionString(state);
  //   let arr = [];

  //   switch (navigateTo) {
  //     case "LOAD_APP":
  //       arr.push(<Stack.Screen name="SplashScreen" component={SplashScreen} />);
  //       break;

  //     case "LOAD_SIGNUP":
  //       arr.push(
  //         <Stack.Screen
  //           name="SignUpScreen"
  //           component={SignUpScreen}
  //           options={{
  //             title: "Sign Up",
  //             animationTypeForReplace: state.isSignedOut ? "pop" : "push",
  //           }}
  //         />
  //       );
  //       break;
  //     case "LOAD_SIGNIN":
  //       arr.push(<Stack.Screen name="SignInScreen" component={SignIn} />);
  //       break;

  //     case "LOAD_HOME":
  //       arr.push(
  //         <Drawer.Navigator
  //           drawerContent={(props) => <DrawerContent {...props} />}
  //         >
  //           <Drawer.Screen name="Home" component={StackNavigator} />
  //           {/* <Drawer.Screen name="Account" component={AccountStackNavigator} /> */}
  //         </Drawer.Navigator>
  //       );
  //       break;
  //     default:
  //       arr.push(<Stack.Screen name="SignInScreen" component={SignIn} />);
  //       break;
  //   }
  //   return arr[0];
  // };

  const onReady = isReadyRef.current as React.MutableRefObject<boolean>;

  React.useEffect(() => {
    return () => {
      // onReady.current = false;
      (isReadyRef as React.MutableRefObject<boolean>).current = false;
    };
  }, []);

  console.log("root state", navigationRef?.current?.getRootState());

  console.log(state.isSignedIn);
  const theme = useTheme();
  const navigationTheme = theme.dark ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          // onReady.current = true;
          (isReadyRef as React.MutableRefObject<boolean>).current = true;
        }}
        theme={navigationTheme}
      >
        <>
          <>
            {state.isSignedIn ? <DrawerNavigator /> : <AccountStackNavigator />}
          </>
        </>
      </NavigationContainer>
    </>
  );
};
