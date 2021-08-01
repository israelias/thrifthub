import React from 'react';
import { View, StyleSheet, Text, TextInputProps } from 'react-native';
import { TextInput as Input, useTheme } from 'react-native-paper';
import { LogicProps } from 'react-native-paper-form-builder/dist/Types/Types';
import { useController } from 'react-hook-form';
interface Props extends TextInputProps {
  errorText: string;
  description: string;
}

export default function TextInput({ errorText, description }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Input
        style={{ backgroundColor: theme.colors.surface }}
        // selectionColor={theme.colors.surface}
        underlineColor="transparent"
        mode="outlined"
      />
      {description && !errorText ? (
        <Text
          style={{
            color: theme.colors.text,
            paddingTop: 8,
            fontSize: 13,
          }}
        >
          {description}
        </Text>
      ) : null}
      {errorText ? (
        <Text
          style={{
            fontSize: 13,
            color: theme.colors.error,
            paddingTop: 8,
          }}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
});
