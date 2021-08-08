import React from 'react';

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
  isLoading: boolean;
  noAccount: boolean;
  accessToken?: string | null;
  error?: any;
  state: AuthStateInterface;
};

export const AuthContext = React.createContext<AuthDataType>(
  undefined!
);

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

// export const authReducer = (
//   prevState = initialState,
//   action: AuthAction
// ): AuthStateInterface => {
//   switch (action.type) {
//     case AuthActionTypes.TO_SIGNUP_PAGE:
//       return {
//         ...prevState,
//         isLoading: false,
//         isSignedUp: false,
//         noAccount: true,
//       };
//     case AuthActionTypes.TO_SIGNIN_PAGE:
//       return {
//         ...prevState,
//         isLoading: false,
//         isSignedIn: false,
//         noAccount: false,
//       };
//     case AuthActionTypes.RESTORE_TOKEN:
//       return {
//         ...prevState,
//         accessToken: action.accessToken,
//         isLoading: false,
//       };
//     case AuthActionTypes.SIGNED_UP:
//       return {
//         ...prevState,
//         isSignedIn: true,
//         isSignedUp: true,
//         isLoading: false,
//         accessToken: action.accessToken,
//       };
//     case AuthActionTypes.SIGN_IN:
//       return {
//         ...prevState,
//         isSignedOut: false,
//         isSignedIn: true,
//         isSignedUp: true,
//         accessToken: action.accessToken,
//       };
//     case AuthActionTypes.SIGN_OUT:
//       return {
//         ...prevState,
//         isSignedOut: true,
//         accessToken: null,
//       };
//   }
// };

export const stateConditionString = (state: AuthStateInterface) => {
  let navigateTo = '';
  if (state.isLoading) {
    navigateTo = 'LOAD_APP';
  }
  if (state.isSignedIn && state.accessToken && state.isSignedUp) {
    navigateTo = 'LOAD_HOME';
  }
  if (!state.isSignedUp && state.noAccount) {
    navigateTo = 'LOAD_SIGNUP';
  }
  if (!state.isSignedIn && !state.noAccount) {
    navigateTo = 'LOAD_SIGNIN';
  }
  return navigateTo;
};
