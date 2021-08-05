import React from 'react';
import { Platform, View } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import {
  AccountStackNavigatorParamList,
  ProductStackNavigatorParamList,
} from '../types';

import { Toast } from '../components/common/toast';

import { localStorage } from '../utils/storage';
import { nativeStorage } from '../utils/nativeStorage';
import {
  signInRequest,
  signUpRequest,
  signOutRequest,
} from '../services/auth.service';

import { AuthResponseType } from '../types';
import { useVendorData, VendorActionTypes } from './vendor.context';

export type AllRoutes = AccountStackNavigatorParamList &
  ProductStackNavigatorParamList;

export enum AuthActionTypes {
  TO_SIGNUP_PAGE,
  TO_SIGNIN_PAGE,
  RESTORE_TOKEN,
  RESTORE_TOKEN_ERROR,
  SIGNING_IN,
  SIGNING_IN_ERROR,
  SIGNING_OUT,
  SIGNING_OUT_ERROR,
  SIGNED_UP,
  SIGN_IN,
  SIGN_OUT,
}

export interface AuthAction {
  type: AuthActionTypes;
  accessToken?: null | string;
  error?: any;
}

export type AuthStateInterface = {
  isLoading: boolean;
  isSignedOut: boolean;
  isSignedUp: boolean;
  isSignedIn: boolean;
  noAccount: boolean;
  accessToken?: null | string;
  error?: any;
};

export const initialState = {
  isLoading: true,
  isSignedOut: false,
  isSignedUp: false,
  noAccount: false,
  isSignedIn: false,
  accessToken: null,
  refreshToken: null,
  error: undefined,
};

export type AuthDataType = {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  isSignedOut: boolean;
  isSignedIn: boolean;
  isSignedUp: boolean;
  isLoading: boolean;
  noAccount: boolean;
  accessToken?: string | null;
  error?: any;
  state: AuthStateInterface;
};

export const AuthContext = React.createContext<AuthDataType>(
  undefined!
);

export default function AuthorizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(
    (
      prevState: AuthStateInterface,
      { type, error, accessToken }: AuthAction
    ) => {
      switch (type) {
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
            accessToken,
            isLoading: false,
          };
        case AuthActionTypes.RESTORE_TOKEN_ERROR:
          return {
            ...prevState,
            error,
            isLoading: false,
          };

        case AuthActionTypes.SIGNED_UP:
          return {
            ...prevState,
            isSignedIn: true,
            isSignedUp: true,
            isLoading: false,
            accessToken,
          };
        case AuthActionTypes.SIGNING_IN:
          return {
            ...prevState,
            isLoading: true,
          };
        case AuthActionTypes.SIGNING_IN_ERROR:
          return {
            ...prevState,
            isLoading: false,
            error: error,
          };
        case AuthActionTypes.SIGN_IN:
          return {
            ...prevState,
            isSignedOut: false,
            isSignedIn: true,
            isSignedUp: true,
            accessToken,
          };
        case AuthActionTypes.SIGNING_OUT:
          return {
            ...prevState,
            loading: true,
          };

        case AuthActionTypes.SIGN_OUT:
          return {
            ...prevState,
            isLoading: false,
            isSignedOut: true,
            accessToken: null,
            refreshToken: null,
          };
        case AuthActionTypes.SIGNING_OUT_ERROR:
          return {
            ...prevState,
            isLoading: false,
            error,
          };
      }
    },
    initialState
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      if (Platform.OS !== 'web') {
        try {
          const nativeToken = await nativeStorage.getToken();
          if (nativeToken) {
            userToken = nativeToken;
          }
        } catch (error: any) {
          // Restoring token failed
          dispatch({
            type: AuthActionTypes.RESTORE_TOKEN_ERROR,
            accessToken: null,
            error,
          });
          console.log('error', error.message);
        }
      }

      try {
        console.log('else');
        const localToken = await localStorage.getToken();
        if (localToken) {
          console.log('token in local', localToken);
          userToken = localToken;
          dispatch({
            type: AuthActionTypes.RESTORE_TOKEN,
            accessToken: localToken,
          });
        }
      } catch (error: any) {
        dispatch({
          type: AuthActionTypes.RESTORE_TOKEN_ERROR,
          accessToken: null,
          error,
        });
        console.log('error', error.message);
      }

      console.log('fetched token', userToken);

      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.

      dispatch({
        type: AuthActionTypes.RESTORE_TOKEN,
        accessToken: userToken,
      });

      console.log('stored to state', state.accessToken);
    };
    bootstrapAsync();
  }, []);

  const { dispatch: vendorDispatch } = useVendorData();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [message, setMessage] = React.useState<string | any>('');

  const onSuccess = (text: string | any) => {
    setMessage(text);
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
      setMessage('');
    }, 2500);
  };
  const onWarning = (text: string | any) => {
    setMessage(text);
    setOpenWarning(true);
    setTimeout(() => {
      setOpenWarning(false);
      setMessage('');
    }, 2500);
  };
  const onError = (text: string | any) => {
    setMessage(text);
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
      setMessage('');
    }, 2500);
  };
  console.log('second stored to state', state.accessToken);
  // In a production app, we need to send some data (usually username, password) to server and get a token
  // We will also need to handle errors if sign in failed
  // After getting token, we need to persist the token using `AsyncStorage`
  const authContextValue = React.useMemo(
    () => ({
      signIn: async (
        username: string,
        password: string,
        navigation?: StackNavigationProp<AllRoutes>
      ) => {
        /**
         * If credentials are validated...
         */
        if (username !== undefined && password !== undefined) {
          /**
           * Dispatch auth to launch loading.
           */
          dispatch({
            type: AuthActionTypes.SIGNING_IN,
          });
          /**
           * Fetch sign in to backend with credentials.
           */
          await signInRequest({
            body: {
              username,
              password,
            },
          }).then((response) => {
            /**
             * If status is ~200/successful...
             */
            if (response.ok) {
              /**
               * Serialize the payload from backend.
               */
              response.json().then((data: AuthResponseType) => {
                /**
                 * Ensure there's data in the payload.
                 */
                if (data) {
                  console.log('Sign In Data', data);
                  /**
                   * Dispatch that sign in was a success
                   */
                  dispatch({
                    type: AuthActionTypes.SIGN_IN,
                    accessToken: data.access,
                  });
                  /**
                   * If we're running natively, set the native local token
                   */
                  if (Platform.OS !== 'web') {
                    console.log('native set token');
                    nativeStorage.setToken(data.access);
                  }
                  /**
                   * Set the local token
                   */
                  localStorage.setToken(data.access);
                  /**
                   * Dispatch the user data to vendor provider
                   */
                  vendorDispatch({
                    type: VendorActionTypes.fetchVendorSuccess,
                    vendor: data.user,
                  });
                  /**
                   * Display a snackbar message
                   */
                  onSuccess(`Welcome back, ${data.user.name}`);
                }
              });
            } else {
              /**
               * Dispatch that Sign in failed
               */
              dispatch({
                type: AuthActionTypes.SIGNING_IN_ERROR,
                error: response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : { message: 'Sign In Failed' }
                  ),
              });
              /**
               * Dispatch to vendor provider that user data fetch failed
               */
              vendorDispatch({
                type: VendorActionTypes.fetchVendorFailure,
              });
              /**
               * Display a snackbar message
               */
              onWarning(
                response
                  .json()
                  .then((data) =>
                    data ? JSON.parse(data) : 'Sign In Failed'
                  )
              );
            }
          });
        } else {
          /**
           * Dispatch Auth that credentials failed
           */
          dispatch({
            type: AuthActionTypes.TO_SIGNIN_PAGE,
          });
          /**
           * Display Error snackbar message
           */
          onError('Request Failed');
        }
      },

      signOut: async () => {
        console.log('AuthContext: Sign out');
        /**
         * Dispatch auth to launch loading.
         */
        dispatch({
          type: AuthActionTypes.SIGNING_OUT,
        });
        /**
         * Fetch sign out to backend with access token.
         */
        await signOutRequest({
          accessToken: state.accessToken,
        }).then((response) => {
          /**
           * If status is ~200/successful...
           */
          if (response.ok) {
            /**
             * Dispatch auth to launch sign out event.
             */
            dispatch({ type: AuthActionTypes.SIGN_OUT });
            /**
             * Display successful snackbar message.
             */
            onSuccess('Signed Out');
          } else {
            /**
             * Dispatch auth to laucnh sigg out failure event.
             */
            dispatch({
              type: AuthActionTypes.SIGNING_OUT_ERROR,
              error: response
                .json()
                .then((data) =>
                  data
                    ? JSON.parse(data)
                    : { message: 'Sign Out Failed' }
                ),
            });
            /**
             * Display warning snackbar message.
             */
            onWarning(
              response
                .json()
                .then((data) =>
                  data ? JSON.parse(data) : 'Sign Out Failed'
                )
            );
          }
        });
      },

      signUp: async (
        username: string,
        email: string,
        password: string
      ) => {
        /**
         * If credentials are validated...
         */
        if (
          username !== undefined &&
          email !== undefined &&
          password !== undefined
        ) {
          /**
           * Dispatch auth to launch loading.
           */
          dispatch({
            type: AuthActionTypes.SIGNING_IN,
          });
          /**
           * Fetch sign up to backend with credentials.
           */
          await signUpRequest({
            body: {
              username,
              email,
              password,
            },
          }).then((response) => {
            /**
             * If status is ~200/successful...
             */
            if (response.ok) {
              /**
               * Serialize the payload from backend.
               */
              response.json().then((data: AuthResponseType) => {
                /**
                 * Ensure there's data in the payload.
                 */
                if (data) {
                  /**
                   * Dispatch auth that sign up was a success
                   */
                  dispatch({
                    type: AuthActionTypes.SIGNED_UP,
                    accessToken: data.access,
                  });
                  /**
                   * If we're running natively, set the native local token
                   */
                  if (Platform.OS !== 'web') {
                    console.log('native set token');
                    nativeStorage.setToken(data.access);
                  }
                  /**
                   * Set the local token
                   */
                  localStorage.setToken(data.access);
                  /**
                   * Dispatch the user data to vendor provider
                   */
                  vendorDispatch({
                    type: VendorActionTypes.fetchVendorSuccess,
                    vendor: data.user,
                  });
                  /**
                   * Display a successful snackbar message
                   */
                  onSuccess('Account Created');
                }
              });
            } else {
              /**
               * Dispatch auth that Sign up failed
               */
              dispatch({
                type: AuthActionTypes.SIGNING_IN_ERROR,
                error: response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : { message: 'Sign Up Failed' }
                  ),
              });
              /**
               * Dispatch to vendor provider that fetching user data failed.
               */
              vendorDispatch({
                type: VendorActionTypes.fetchVendorFailure,
              });
              /**
               * Display warning snackbar message
               */
              onWarning(
                response
                  .json()
                  .then((data) =>
                    data ? JSON.parse(data) : 'Sign Up Failed'
                  )
              );
            }
          });
        } else {
          /**
           * Dispatch auth that credentials are invalid.
           */
          dispatch({
            type: AuthActionTypes.TO_SIGNUP_PAGE,
          });
          /**
           * Display Error snackbar message
           */
          onError('Request Failed');
        }
      },
      state,
      isSignedOut: state.isSignedOut,
      isSignedIn: state.isSignedIn,
      isLoading: state.isLoading,
      noAccount: state.noAccount,
      accessToken: state.accessToken,
      isSignedUp: state.isSignedUp,
    }),

    [state]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <View>
        <Toast
          open={openSuccess}
          setOpen={setOpenSuccess}
          success
          message={message}
        />
        <Toast
          open={openWarning}
          setOpen={setOpenWarning}
          warning
          message={message}
        />
        <Toast
          open={openError}
          setOpen={setOpenError}
          error
          message={message}
        />
      </View>
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
