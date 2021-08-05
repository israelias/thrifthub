import React, { useState } from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {
  useController,
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import _ from 'lodash/fp';
import { ErrorMessage } from '@hookform/error-message';
import { FormBuilder } from 'react-native-paper-form-builder';
import { LogicProps } from 'react-native-paper-form-builder/dist/Types/Types';
import {
  Text,
  useTheme,
  TextInput,
  Button,
  List,
  Checkbox,
  ActivityIndicator,
} from 'react-native-paper';
import BackButton from '../../components/common/backButton';
import Background from '../../components/common/background';
import Header from '../../components/common/header';
import Logo from '../../components/common/logo';

import { StackNavigationProp } from '@react-navigation/stack';
import {
  AccountStackNavigatorParamList,
  AccountStackNavProps,
} from '../../types';

import { useAuth } from '../../context/authorization.context';

type FormValues = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterScreen({
  navigation,
}: {
  navigation: StackNavigationProp<AccountStackNavigatorParamList>;
}) {
  const theme = useTheme();
  const { signIn, signUp, isLoading } = useAuth();
  const [getUsername, setUsername] = useState('');
  const [getEmail, setEmail] = useState('');
  const [getPassword, setPassword] = useState('');

  const {
    control,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit: SubmitHandler<FormValues> = (data, e) => {
    console.log(data, e);
    signUp(data.username, data.email, data.password);
  };
  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    console.log(errors, e);
    navigation.reset({
      index: 0,
      routes: [{ name: 'StartScreen' }],
    });
  };

  return (
    <Background>
      <Logo loading={isLoading} />

      <Header>Create Account</Header>
      <View style={styles.container}>
        <FormBuilder
          inputSpacing={12}
          inputSpacingHorizontal={4}
          theme={theme}
          control={control}
          setFocus={setFocus}
          formConfigArray={[
            {
              name: 'username',
              type: 'text',
              textInputProps: {
                label: 'Username',
                style: styles.textInput,
                left: <TextInput.Icon name={'account'} />,
                underlineColor: 'transparent',
                mode: 'outlined',
                textContentType: 'username',
                returnKeyType: 'next',
                keyboardType: 'default',
                value: getUsername,
                onChangeText: (username) => setUsername(username),
              },
              rules: {
                required: {
                  value: true,
                  message: 'Username is required',
                },
              },
            },
            {
              name: 'email',
              type: 'email',
              textInputProps: {
                label: 'Email',
                left: <TextInput.Icon name={'email'} />,
                underlineColor: 'transparent',
                mode: 'outlined',
                autoCapitalize: 'none',
                autoCompleteType: 'email',
                textContentType: 'emailAddress',
                keyboardType: 'email-address',
                returnKeyType: 'next',
                value: getEmail,
                onChangeText: (email) => setEmail(email),
              },
              rules: {
                required: {
                  value: true,
                  message: 'Email is required',
                },
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  // value:
                  //   /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                  message: 'Email is invalid',
                },
              },
            },
            {
              name: 'password',
              type: 'password',
              textInputProps: {
                label: 'Password',
                style: styles.textInput,
                left: <TextInput.Icon name={'lock'} />,
                underlineColor: 'transparent',
                mode: 'outlined',
                textContentType: 'password',
                returnKeyType: 'done',
                keyboardType: 'default',
                value: getPassword,
                onChangeText: (password) => setPassword(password),
                secureTextEntry: true,
              },
              rules: {
                required: {
                  value: true,
                  message: 'Password is required',
                },
                minLength: {
                  value: 4,
                  message: 'Password should be atleast 4 characters',
                },
                maxLength: {
                  value: 30,
                  message:
                    'Password should be between 8 and 30 characters',
                },
              },
            },
          ]}
        />
      </View>

      <Button
        mode="contained"
        labelStyle={styles.text}
        style={[styles.button, { marginTop: 24 }]}
        onPress={handleSubmit(onSubmit, onError)}
      >
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.replace('LoginScreen')}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: theme.colors.primary,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  textInput: {
    paddingVertical: 5,
  },
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
  container: {
    width: '100%',
    marginVertical: 12,
  },
});
