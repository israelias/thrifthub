import React from 'react';
import { StyleSheet } from 'react-native';
import Background from '../../components/common/background';
import Logo from '../../components/common/logo';
import Header from '../../components/common/header';
import {
  Paragraph,
  Button,
  Headline,
  useTheme,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountStackNavigatorParamList } from '../../types';
import { useAuth } from '../../context/authorization.context';

export default function StartScreen({
  navigation,
}: {
  navigation: StackNavigationProp<AccountStackNavigatorParamList>;
}) {
  const theme = useTheme();
  // const {
  //   isLoading,
  //   isSignedIn,
  //   accessToken,
  //   noAccount,
  //   isSignedUp,
  // } = useAuth();

  // console.log('isSignedIn', isSignedIn);
  // console.log('isLoading', isLoading);
  // console.log('accessToken', accessToken);
  // console.log('noAccount', noAccount);
  // console.log('isSignedUp', isSignedUp);

  // React.useEffect(() => {
  //   if (isLoading) {
  //     navigation.replace('Dashboard');
  //   }
  //   if (isSignedIn && accessToken && isSignedUp) {
  //     console.log('isSignedIn and accessToken and isSignedUp');
  //     navigation.replace('LoginScreen');
  //   }
  //   if (!isSignedUp && noAccount) {
  //     console.log('not isSignedUp and noAccount');
  //     navigation.replace('RegisterScreen');
  //   }
  //   if (!isSignedIn && !noAccount) {
  //     console.log('not isSignedIn and not noAccount');
  //     navigation.replace('LoginScreen');
  //   }
  // }, [isSignedIn, accessToken, isSignedUp, noAccount, isLoading]);
  return (
    <Background>
      <Logo />
      <Header>Welcome to ThriftHub</Header>
      <Paragraph>
        An online thrift store for second-hand goods!
      </Paragraph>
      <Button
        mode="contained"
        labelStyle={styles.text}
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        labelStyle={styles.text}
        style={[
          styles.button,
          { backgroundColor: theme.colors.surface },
        ]}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
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
});
