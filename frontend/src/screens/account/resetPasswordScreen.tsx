import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  TouchableRipple,
} from 'react-native-paper';

import BackButton from '../../components/common/backButton';
import Background from '../../components/common/background';
import Header from '../../components/common/header';

import { StackNavigationProp } from '@react-navigation/stack';
import { AccountStackNavigatorParamList } from '../../types';

export default function ResetPasswordScreen({
  navigation,
}: {
  navigation: StackNavigationProp<AccountStackNavigatorParamList>;
}) {
  const theme = useTheme();
  const [email, setEmail] = useState({ value: '', error: '' });

  const sendResetPasswordEmail = () => {
    // const emailError = emailValidator(email.value);
    // if (emailError) {
    //   setEmail({ ...email, error: emailError });
    //   return;
    // }
    navigation.navigate('LoginScreen');
  };

  return (
    <Background>
      <TouchableRipple onPress={navigation.goBack}>
        Go Back
      </TouchableRipple>

      <Header>Restore Password</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        // description="You will receive email with password reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Send Instructions
      </Button>
    </Background>
  );
}
