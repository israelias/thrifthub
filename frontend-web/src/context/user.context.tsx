/* eslint-disable no-console */
import * as React from "react";

import { Toast } from "../components/common/toast";
import { useToast, IToastProps } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useLinkTo } from "@react-navigation/native";
import { AuthResponseType } from "../types";
import { storage } from "../utils/storage";
import {
  signInRequest,
  signUpRequest,
  signOutRequest,
} from "../services/auth.service";

import { deleteRequest } from "../services/crud.service";
import { useVendorData, VendorActionTypes } from "./vendor.context";

/**
 * Top-most Context provider for all user authentication: form values, auth errors etc.
 *
 */

export type UserContent = {
  userId: number | string;
  setUserId: React.Dispatch<React.SetStateAction<number | string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  refreshToken: string;
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  heading: string;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  returning: boolean;
  setReturning: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignIn: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleSignOut: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  handleDelete: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const UserContext = React.createContext<UserContent>(undefined!);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dispatch, setVendorId } = useVendorData();

  const [userId, setUserId] = React.useState<number | string>(0);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [accessToken, setAccessToken] = React.useState("");
  const [refreshToken, setRefreshToken] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [password, setPassword] = React.useState("");
  const [heading, setHeading] = React.useState("");
  const [alert, setAlert] = React.useState(false);
  const [returning, setReturning] = React.useState(true);

  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const [message, setMessage] = React.useState<string | any>("");
  const onSuccess = (text: string | any) => {
    setMessage(text);
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
      setMessage("");
    }, 1750);
  };
  const onWarning = (text: string | any) => {
    setMessage(text);
    setOpenWarning(true);
    setTimeout(() => {
      setOpenWarning(false);
      setMessage("");
    }, 1750);
  };
  const onError = (text: string | any) => {
    setMessage(text);
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
      setMessage("");
    }, 1750);
  };

  // const navigation = useNavigation();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    dispatch({ type: VendorActionTypes.fetchVendor });

    if (!returning) {
      try {
        await signUpRequest({
          body: {
            username,
            email,
            password,
          },
        }).then((response) => {
          if (response.ok) {
            response.json().then((data: AuthResponseType) => {
              if (data.access) {
                setEmail("");
                setPassword("");
                setAccessToken(data.access);
                setRefreshToken(data.refresh);
                setUsername(data.user.name);
                setUserId(data.user.id);
                setLoggedIn(true);
                storage.setToken(data.access);
                setVendorId(data.user.id.toString());
                dispatch({
                  type: VendorActionTypes.fetchVendorSuccess,
                  vendor: data.user,
                });

                setTimeout(() => {
                  onSuccess("Account Created");
                }, 750);
                setTimeout(() => {
                  setLoading(false);
                  // navigation.navigate("Home");
                }, 1500);
              }
            });
          } else {
            response.json().then((data) => {
              if (data.message) {
                setLoading(false);

                dispatch({ type: VendorActionTypes.fetchVendorFailure });

                onWarning(data.message);
              }
            });
          }
        });
      } catch (err: any) {
        setLoading(false);

        dispatch({ type: VendorActionTypes.fetchVendorFailure });

        onError(err?.message || "Something went wrong.");
      }
    } else {
      try {
        await signInRequest({
          body: {
            username,
            password,
          },
        }).then((response) => {
          if (response.ok) {
            response.json().then((data: AuthResponseType) => {
              if (data.access) {
                setUsername("");

                setPassword("");
                setAccessToken(data.access);
                setRefreshToken(data.refresh);
                setUsername(data.user.name);
                setUserId(data.user.id);
                setLoggedIn(true);
                storage.setToken(data.access);

                dispatch({
                  type: VendorActionTypes.fetchVendorSuccess,
                  vendor: data.user,
                });

                setTimeout(() => {
                  onSuccess(`Welcome Back, ${data.user.name}`);
                }, 750);
                setTimeout(() => {
                  setLoading(false);
                  // navigation.navigate("Home");
                }, 1500);
              } else {
                setLoading(false);

                dispatch({ type: VendorActionTypes.fetchVendorFailure });

                onWarning("Access Failed");
              }
            });
          } else {
            response.json().then((data) => {
              if (data.message) {
                setLoading(false);

                dispatch({
                  type: VendorActionTypes.fetchVendorFailure,
                  error: data.message,
                });

                onWarning("Request failed");
              }
            });
          }
        });
      } catch (err: any) {
        setLoading(false);

        dispatch({ type: VendorActionTypes.fetchVendorFailure, error: err });

        onError(err.message);
      }
    }
  };

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    onSuccess("Signing Out");

    try {
      await signOutRequest({ accessToken }).then((response) => {
        if (response.ok) {
          setAccessToken("");
          setUsername("");
          setUserId("");
          setLoggedIn(false);
          setReturning(true);
          storage.clearToken();

          setTimeout(() => {
            onSuccess("Signed Out");
          }, 250);
          setTimeout(() => {
            setLoading(false);
            // navigation.navigate(`/`);
          }, 750);
        } else {
          setLoading(false);
          onWarning("Sign Out Failed");
        }
      });
    } catch (err: any) {
      setLoading(false);
      onError(err.message);
    }
  };

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteRequest({
        url: `account/${userId}`,
        accessToken,
      }).then((res) => {
        if (res.ok) {
          setAccessToken("");
          setUsername("");
          setUserId("");
          setLoggedIn(false);
          storage.clearToken();

          setTimeout(() => {
            onSuccess("Account Deleted");
          }, 750);
          setTimeout(() => {
            setLoading(false);

            // navigation.navigate("/");
          }, 1500);
        } else {
          setLoading(false);
          onWarning("Request Failed");
        }
      });
    } catch (err: any) {
      setLoading(false);
      onError(err.message);
    }
  };

  // React.useEffect(() => {
  //   if (!(username || accessToken)) {
  //     navigation.navigate("/");
  //   }
  // }, [username, accessToken]);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        username,
        setUsername,
        email,
        setEmail,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        loggedIn,
        setLoggedIn,
        loading,
        setLoading,
        handleSignIn,
        handleSignOut,
        handleDelete,
        password,
        setPassword,
        heading,
        setHeading,
        alert,
        setAlert,
        returning,
        setReturning,
      }}
    >
      {children}
      {/* <Toast
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
      <Toast open={openError} setOpen={setOpenError} error message={message} /> */}
    </UserContext.Provider>
  );
}

export const useUserContext = () => React.useContext(UserContext);
