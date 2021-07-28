import * as React from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  signInRequest,
  signUpRequest,
  signOutRequest,
} from "../services/auth.service";
import { useVendorData, VendorActionTypes } from "./vendor.context";
import { localStorage } from "../utils/storage";
import { nativeStorage } from "../utils/nativeStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponseType } from "../types";

export enum AccountActionTypes {
  fetchAccount,
  fetchAccountSuccess,
  fetchAccountFailure,
  fetchAccountSignUp,
  fetchAccountSignIn,
  fetchAccountSignOut,
  fetchDeleteAccount,
  fetchAccountToken,
  fetchAccountTokenFailure,
}

export interface FetchAccountAction {
  type: AccountActionTypes;
  accessToken?: string;
}

export interface AccountStateInterface {
  loading: boolean;
  isSignOut?: boolean;
  accessToken?: string;
}

const initialState: AccountStateInterface = {
  loading: true,
  isSignOut: false,
  accessToken: undefined,
};

export type AuthContextType = {
  state: {
    accessToken?: string;
    loading: boolean;
    isSignOut?: boolean;
  };

  actions: {
    register: (token: string) => Promise<void>;
    blacklist: () => Promise<void>;
  };
  dispatch: React.Dispatch<FetchAccountAction>;
};

const AuthContext = React.createContext<AuthContextType>(undefined!);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(
    (
      state: AccountStateInterface,
      { type, accessToken }: FetchAccountAction
    ) => {
      switch (type) {
        case AccountActionTypes.fetchAccount:
          return { ...state, loading: true };

        case AccountActionTypes.fetchAccountToken:
          return {
            ...state,
            accessToken,
            loading: false,
          };

        case AccountActionTypes.fetchAccountTokenFailure:
          return {
            ...state,
            isSignOut: true,
            accessToken: undefined,
          };

        case AccountActionTypes.fetchAccountSignUp:
          return {
            ...state,
            isSignOut: false,
            accessToken,
          };

        case AccountActionTypes.fetchAccountSignIn:
          return {
            ...state,
            isSignOut: false,
            accessToken,
          };

        case AccountActionTypes.fetchAccountSignOut:
          return {
            ...state,
            isSignOut: true,
            accessToken: undefined,
          };

        default:
          return state;
      }
    },
    initialState
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      if (Platform.OS !== "web") {
        try {
          const token = await nativeStorage.getToken();
          if (token) {
            dispatch({
              type: AccountActionTypes.fetchAccountToken,
              accessToken: token,
            });
          }
        } catch (e) {
          // Restoring token failed
          dispatch({
            type: AccountActionTypes.fetchAccountTokenFailure,
          });
        }
      } else {
        try {
          console.log("else");
          const token = await localStorage.getToken();
          if (token) {
            dispatch({
              type: AccountActionTypes.fetchAccountToken,
              accessToken: token,
            });
          }
        } catch (e) {
          dispatch({
            type: AccountActionTypes.fetchAccountTokenFailure,
          });
        }
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // dispatch({
      //   type: AccountActionTypes.fetchAccounTokenFromStorage,
      //   accessToken: JSON.parse(accessToken),
      // });
    };

    bootstrapAsync();
  }, []);

  const actions = React.useMemo(
    () => ({
      register: async (token: string) => {
        dispatch({
          type: AccountActionTypes.fetchAccountToken,
          accessToken: token,
        });
      },
      blacklist: async () => {
        dispatch({
          type: AccountActionTypes.fetchAccountSignOut,
        });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ state, actions, dispatch }}>
      {children}
      {/* <Stack.Navigator>
        {state.accessToken ? (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator> */}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
