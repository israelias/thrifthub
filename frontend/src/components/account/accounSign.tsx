import React, { Fragment } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

import { useController, useForm } from "react-hook-form";
import { Button, Checkbox, List, TextInput } from "react-native-paper";
import { FormBuilder } from "react-native-paper-form-builder";
import { LogicProps } from "react-native-paper-form-builder/dist/Types/Types";
import { useUserContext } from "../../context/user.context";

import { AuthContext } from "../../context/authUtils";

export function SignIn() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    returning,
    setReturning,
  } = useUserContext();

  const { signIn, signUp } = React.useContext(AuthContext);

  const handleSignInn = (
    e: React.BaseSyntheticEvent<React.FunctionComponent>
  ) => {
    signIn(username, password);
  };

  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      // email: "",
      password: "",
      rememberMe: "checked",
    },
    mode: "onChange",
  });

  const onUsernameChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    const value = event.nativeEvent.text;
    if (value === "") {
      setUsername("");
    }
    setUsername(value);
  };

  // const onEmailChange = (
  //   event: NativeSyntheticEvent<TextInputChangeEventData>
  // ) => {
  //   const value = event.nativeEvent.text;
  //   if (value === "") {
  //     setEmail("");
  //   }
  //   setEmail(value);
  // };

  const onPasswordChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    const value = event.nativeEvent.text;
    if (value === "") {
      setPassword("");
    }
    setPassword(value);
  };

  return (
    <Fragment>
      <FormBuilder
        control={control}
        setFocus={setFocus}
        formConfigArray={[
          {
            name: "username",
            type: "text",
            textInputProps: {
              label: "Username",
              left: <TextInput.Icon name={"account"} />,
              value: username,
              onChange: onUsernameChange,
            },
            rules: {
              required: {
                value: true,
                message: "Username is required",
              },
            },
          },
          // {
          //   name: "email",
          //   type: "email",
          //   textInputProps: {
          //     label: "Email",
          //     left: <TextInput.Icon name={"email"} />,
          //     value: email,
          //     onChange: onEmailChange,
          //   },
          //   rules: {
          //     required: {
          //       value: true,
          //       message: "Email is required",
          //     },
          //     pattern: {
          //       value:
          //         /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
          //       message: "Email is invalid",
          //     },
          //   },
          // },
          {
            name: "password",
            type: "password",
            textInputProps: {
              label: "Password",
              left: <TextInput.Icon name={"lock"} />,
              value: password,
              onChange: onPasswordChange,
            },
            rules: {
              required: {
                value: true,
                message: "Password is required",
              },
              minLength: {
                value: 4,
                message: "Password should be atleast 4 characters",
              },
              maxLength: {
                value: 30,
                message: "Password should be between 8 and 30 characters",
              },
            },
          },
        ]}
      />
      <Button mode={"contained"} onPress={handleSubmit(handleSignInn)}>
        Submit
      </Button>
    </Fragment>
  );
}
