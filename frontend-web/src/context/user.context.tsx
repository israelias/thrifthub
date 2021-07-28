/* eslint-disable no-console */
import * as React from "react";

import * as Navigator from "../navigation/rootNavigator";
import { Toast } from "../components/common/toast";
import { useToast, IToastProps } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useLinkTo } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AuthResponseType } from "../types";
import { localStorage } from "../utils/storage";
import { nativeStorage } from "../utils/nativeStorage";
import {
  signInRequest,
  signUpRequest,
  signOutRequest,
} from "../services/auth.service";

import { deleteRequest } from "../services/crud.service";
import { useVendorData, VendorActionTypes } from "./vendor.context";
import { useAuth, AccountActionTypes } from "./auth.context";

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
  handleSignIn: (
    e: React.BaseSyntheticEvent<React.FunctionComponent>
  ) => Promise<void>;
  handleSignOut: (
    e: React.BaseSyntheticEvent<React.FunctionComponent>
  ) => Promise<void>;
  handleDelete: (
    e: React.BaseSyntheticEvent<React.FunctionComponent>
  ) => Promise<void>;
};

export const UserContext = React.createContext<UserContent>(undefined!);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dispatch: vendorDispatch, setVendorId } = useVendorData();
  // const { dispatch: authDispatch, state, actions } = useAuth();

  const [userId, setUserId] = React.useState<number | string>(0);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");

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

  const handleSignIn = async (
    e: React.BaseSyntheticEvent<React.FunctionComponent>
  ) => {
    // authDispatch({
    //   type: AccountActionTypes.fetchAccount,
    // });
    vendorDispatch({ type: VendorActionTypes.fetchVendor });

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

                setUsername(data.user.name);
                setUserId(data.user.id);

                setVendorId(data.user.id.toString());

                // authDispatch({
                //   type: AccountActionTypes.fetchAccountSignUp,
                //   accessToken: data.access,
                // });

                // actions.register(data.access);

                vendorDispatch({
                  type: VendorActionTypes.fetchVendorSuccess,
                  vendor: data.user,
                });

                setTimeout(() => {
                  onSuccess("Account Created");
                }, 750);
                setTimeout(() => {
                  setLoading(false);
                }, 1500);
              }
            });
          } else {
            response.json().then((data) => {
              if (data.message) {
                setLoading(false);

                // authDispatch({
                //   type: AccountActionTypes.fetchAccountTokenFailure,
                //   accessToken: null,
                // });
                // actions.blacklist();

                vendorDispatch({ type: VendorActionTypes.fetchVendorFailure });

                onWarning(data.message);
              }
            });
          }
        });
      } catch (err: any) {
        setLoading(false);

        // authDispatch({
        //   type: AccountActionTypes.fetchAccountTokenFailure,
        //   accessToken: null,
        // });
        // actions.blacklist();

        vendorDispatch({ type: VendorActionTypes.fetchVendorFailure });

        console.log(err?.message || "Something went wrong.");
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

                setUsername(data.user.name);
                setUserId(data.user.id);

                // actions.register(data.access);

                // authDispatch({
                //   type: AccountActionTypes.fetchAccountSignIn,
                //   accessToken: data.access,
                // });

                vendorDispatch({
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

                // authDispatch({
                //   type: AccountActionTypes.fetchAccountTokenFailure,
                //   accessToken: null,
                // });

                // actions.blacklist();

                vendorDispatch({ type: VendorActionTypes.fetchVendorFailure });

                console.log("Access Failed");
              }
            });
          } else {
            response.json().then((data) => {
              if (data.message) {
                setLoading(false);

                // authDispatch({
                //   type: AccountActionTypes.fetchAccountTokenFailure,
                // });
                // actions.blacklist();

                vendorDispatch({
                  type: VendorActionTypes.fetchVendorFailure,
                  error: data.message,
                });

                console.log("Request failed");
              }
            });
          }
        });
      } catch (err: any) {
        setLoading(false);

        // authDispatch({
        //   type: AccountActionTypes.fetchAccountTokenFailure,
        // });
        // actions.blacklist();

        vendorDispatch({
          type: VendorActionTypes.fetchVendorFailure,
          error: err,
        });

        console.log(err.message);
      }
    }
  };

  const handleSignOut = async (
    e: React.BaseSyntheticEvent<React.FunctionComponent>
  ) => {
    setLoading(true);

    const localToken = await localStorage.getToken();

    try {
      await signOutRequest({
        accessToken: localToken,
      }).then((response) => {
        if (response.ok) {
          setUsername("");
          setUserId("");

          setReturning(true);

          // actions.blacklist();

          setTimeout(() => {
            onSuccess("Signed Out");
          }, 250);
          setTimeout(() => {
            setLoading(false);
            // navigation.navigate(`/`);
          }, 750);
        } else {
          setLoading(false);
          console.log("Sign Out Failed");
        }
      });
    } catch (err: any) {
      setLoading(false);
      console.log(err.message);
    }
  };

  const handleDelete = async (
    e: React.BaseSyntheticEvent<React.FunctionComponent>
  ) => {
    setLoading(true);
    try {
      await deleteRequest({
        url: `account/${userId}`,
        accessToken: "",
      }).then((res) => {
        if (res.ok) {
          setUsername("");
          setUserId("");

          setTimeout(() => {
            onSuccess("Account Deleted");
          }, 750);
          setTimeout(() => {
            setLoading(false);
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
