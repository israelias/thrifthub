import React from "react";
import { Platform } from "react-native";
import * as Navigator from "../navigation/rootNavigator";
import {
  authReducer,
  AuthContext,
  initialState,
  AuthAction,
  AuthStateInterface,
  AuthActionTypes,
  stateConditionString,
} from "./authUtils";
import { localStorage } from "../utils/storage";
import { nativeStorage } from "../utils/nativeStorage";
import {
  signInRequest,
  signUpRequest,
  signOutRequest,
} from "../services/auth.service";
import { AccountActionTypes } from "./auth.context";
import { AuthResponseType } from "../types";
import { useVendorData, VendorActionTypes } from "./vendor.context";

export default function AuthorizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(
    (prevState = initialState, action: AuthAction): AuthStateInterface => {
      switch (action.type) {
        case AuthActionTypes.TO_SIGNUP_PAGE:
          return {
            ...prevState,
            isLoading: false,
            isSignedUp: false,
            noAccount: true,
          };
        case AuthActionTypes.TO_SIGNIN_PAGE:
          return {
            ...prevState,
            isLoading: false,
            isSignedIn: false,
            noAccount: false,
          };
        case AuthActionTypes.RESTORE_TOKEN:
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case AuthActionTypes.SIGNED_UP:
          return {
            ...prevState,
            isSignedIn: true,
            isSignedUp: true,
            isLoading: false,
            userToken: action.token,
          };
        case AuthActionTypes.SIGN_IN:
          return {
            ...prevState,
            isSignedOut: false,
            isSignedIn: true,
            isSignedUp: true,
            userToken: action.token,
          };
        case AuthActionTypes.SIGN_OUT:
          return {
            ...prevState,
            isSignedOut: true,
          };
      }
    },
    initialState
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      if (Platform.OS !== "web") {
        try {
          userToken = await nativeStorage.getToken();
        } catch (e: any) {
          // Restoring token failed
          console.log("error", e.message);
        }
      }

      try {
        console.log("else");
        userToken = await localStorage.getToken();
      } catch (e: any) {
        console.log("error", e.message);
      }

      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: AuthActionTypes.RESTORE_TOKEN, token: userToken });
    };
    bootstrapAsync();
  }, []);

  const { dispatch: vendorDispatch, setVendorId } = useVendorData();

  // In a production app, we need to send some data (usually username, password) to server and get a token
  // We will also need to handle errors if sign in failed
  // After getting token, we need to persist the token using `AsyncStorage`
  const authContextValue = React.useMemo(
    () => ({
      signIn: async (username: string, password: string) => {
        if (username !== undefined && password !== undefined) {
          await signInRequest({
            body: {
              username,
              password,
            },
          }).then((response) => {
            if (response.ok) {
              response.json().then((data: AuthResponseType) => {
                if (data) {
                  console.log(data);
                  dispatch({
                    type: AuthActionTypes.SIGN_IN,
                    token: data.access,
                  });
                  vendorDispatch({
                    type: VendorActionTypes.fetchVendorSuccess,
                    vendor: data.user,
                  });
                  // @ts-ignore
                  Navigator.changeStack("Products");
                  console.log(Navigator.changeStack("Products"));
                }
              });
            } else {
              vendorDispatch({
                type: VendorActionTypes.fetchVendorFailure,
              });
              console.log("Request failed");
            }
          });
        } else {
          dispatch({ type: AuthActionTypes.TO_SIGNIN_PAGE, token: null });
        }
      },

      signOut: async () => {
        await signOutRequest({
          accessToken: state.userToken,
        }).then((response) => {
          if (response.ok) {
            dispatch({ type: AuthActionTypes.SIGN_OUT, token: null });
          } else {
            console.log("Sign Out Failed");
          }
        });
      },

      signUp: async (username: string, email: string, password: string) => {
        if (
          username !== undefined &&
          email !== undefined &&
          password !== undefined
        ) {
          await signUpRequest({
            body: {
              username,
              email,
              password,
            },
          }).then((response) => {
            if (response.ok) {
              response.json().then((data: AuthResponseType) => {
                if (data) {
                  dispatch({
                    type: AuthActionTypes.SIGNED_UP,
                    token: data.access,
                  });

                  setVendorId(data.user.id.toString());

                  vendorDispatch({
                    type: VendorActionTypes.fetchVendorSuccess,
                    vendor: data.user,
                  });
                }
              });
            } else {
              vendorDispatch({
                type: VendorActionTypes.fetchVendorFailure,
              });
            }
          });
        } else {
          dispatch({ type: AuthActionTypes.TO_SIGNUP_PAGE, token: null });
        }
      },
      state,
      isSignedOut: state.isSignedOut,
      isSignedIn: state.isSignedIn,
      isLoading: state.isLoading,
      noAccount: state.noAccount,
      userToken: state.userToken,
    }),

    [state]
  );

  // const chooseScreen = (state: AuthStateInterface) => {
  //   let navigateTo = stateConditionString(state);
  //   let arr = [];

  //   switch (navigateTo) {
  //     case "LOAD_APP":
  //       arr.push(<Stack.Screen name="Splash" component={SplashScreen} />);
  //       break;

  //     case "LOAD_SIGNUP":
  //       arr.push(
  //         <Stack.Screen
  //           name="SignUp"
  //           component={SignUpScreen}
  //           options={{
  //             title: "Sign Up",
  //             animationTypeForReplace: state.isSignout ? "pop" : "push",
  //           }}
  //         />
  //       );
  //       break;
  //     case "LOAD_SIGNIN":
  //       arr.push(<Stack.Screen name="SignIn" component={SignInScreen} />);
  //       break;

  //     case "LOAD_HOME":
  //       arr.push(
  //         <Stack.Screen
  //           name="Home"
  //           component={createHomeStack}
  //           options={{
  //             title: "Home Screen Parent",
  //             headerStyle: { backgroundColor: "black" },
  //             headerTintColor: "white",
  //           }}
  //         />
  //       );
  //       break;
  //     default:
  //       arr.push(<Stack.Screen name="SignIn" component={SignInScreen} />);
  //       break;
  //   }
  //   return arr[0];
  // };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      {/* <NavigationContainer>
        <Stack.Navigator>{chooseScreen(state)}</Stack.Navigator>
      </NavigationContainer> */}
    </AuthContext.Provider>
  );
}
