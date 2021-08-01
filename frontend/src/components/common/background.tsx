import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme, Surface } from 'react-native-paper';

export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <ImageBackground
      source={require('../../assets/background_dot.png')}
      resizeMode="repeat"
      style={[
        styles.background,
        { backgroundColor: theme.colors.surface },
      ]}
      // style={{ flex: 1, width: "100%", backgroundColor: theme.colors.surface }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
