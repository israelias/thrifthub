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
import Background from '../../components/common/background';
import Logo from '../../components/common/logo';
import Header from '../../components/common/header';
import BackButton from '../../components/common/backButton';

import { useAuth } from '../../context/authorization.context';

import { StackNavigationProp } from '@react-navigation/stack';
import { AccountStackNavigatorParamList } from '../../types';

type FormValues = {
  username: string;
  password: string;
};

export default function LoginScreen({
  navigation,
}: {
  navigation: StackNavigationProp<AccountStackNavigatorParamList>;
}) {
  const theme = useTheme();
  const { signIn, isLoading } = useAuth();
  const [getUsername, setUsername] = useState('');
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
    signIn(data.username, data.password);
  };
  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    console.log(errors, e);
    // navigation.reset({});
  };

  return (
    <Background>
      <Logo loading={isLoading} />

      <Header>Welcome Back</Header>

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
                autoCapitalize: 'none',
                value: getUsername,
                onChangeText: (username) => setUsername(username),
                onSubmitEditing: () => setFocus('password'),
              },
              rules: {
                required: {
                  value: true,
                  message: 'Username is required',
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
                returnKeyType: 'send',
                keyboardType: 'default',
                value: getPassword,
                onChangeText: (password) => setPassword(password),
                secureTextEntry: true,
                onSubmitEditing: () =>
                  handleSubmit(onSubmit, onError),
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
        mode={'contained'}
        labelStyle={styles.text}
        style={[styles.button, { marginTop: 24 }]}
        onPress={handleSubmit(onSubmit, onError)}
      >
        LogIn
      </Button>

      <ErrorMessage
        errors={errors}
        name="username"
        render={({ messages }) => {
          console.log('messages', messages);
          return (
            messages &&
            _.entries(messages).map(([type, message]) => (
              <Text key={type}>{message}</Text>
            ))
          );
        }}
      />

      <ErrorMessage
        errors={errors}
        name="password"
        render={({ messages }) => {
          console.log('messages', messages);
          return (
            messages &&
            _.entries(messages).map(([type, message]) => (
              <Text key={type}>{message}</Text>
            ))
          );
        }}
      />

      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.replace('RegisterScreen')}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: theme.colors.primary,
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

function ForgotPassword({
  navigation,
}: {
  navigation: StackNavigationProp<AccountStackNavigatorParamList>;
}) {
  return (
    <View style={styles.forgotPassword}>
      <TouchableOpacity
      // onPress={() => navigation.navigate('ResetPassword')}
      >
        <Text style={styles.forgotPassword}>
          Forgot your password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function RememberMe(props: LogicProps) {
  const { name, rules, shouldUnregister, defaultValue, control } =
    props;
  const { field } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
  });

  return (
    <List.Item
      title={'Remember me'}
      left={() => (
        <Checkbox.Android
          status={field.value}
          onPress={() => {
            field.onChange(
              field.value === 'checked' ? 'unchecked' : 'checked'
            );
          }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  halfContainer: {
    flex: 1,
    padding: 8,
  },
  headline: {
    textAlign: 'center',
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
