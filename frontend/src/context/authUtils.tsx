import React from "react";

export type AuthDataType = {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  isSignedOut: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  noAccount: boolean;
  userToken: string | null;
  state: AuthStateInterface;
};

export const AuthContext = React.createContext<AuthDataType>(undefined!);

export enum AuthActionTypes {
  TO_SIGNUP_PAGE,
  TO_SIGNIN_PAGE,
  RESTORE_TOKEN,
  SIGNED_UP,
  SIGN_IN,
  SIGN_OUT,
}

export interface AuthAction {
  type: AuthActionTypes;
  token: null | string;
}

export type AuthStateInterface = {
  isLoading: boolean;
  isSignedOut: boolean;
  isSignedUp: boolean;
  isSignedIn: boolean;
  noAccount: boolean;
  userToken: null | string;
};

export const initialState = {
  isLoading: true,
  isSignedOut: false,
  isSignedUp: false,
  noAccount: false,
  isSignedIn: false,
  userToken: null,
};

export const authReducer = (
  prevState = initialState,
  action: AuthAction
): AuthStateInterface => {
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
};

export const stateConditionString = (state: AuthStateInterface) => {
  let navigateTo = "";
  if (state.isLoading) {
    navigateTo = "LOAD_APP";
  }
  if (state.isSignedIn && state.userToken && state.isSignedUp) {
    navigateTo = "LOAD_HOME";
  }
  if (!state.isSignedUp && state.noAccount) {
    navigateTo = "LOAD_SIGNUP";
  }
  if (!state.isSignedIn && !state.noAccount) {
    navigateTo = "LOAD_SIGNIN";
  }
  return navigateTo;
};
