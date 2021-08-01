import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { DEFAULT_ICON } from '../../constants/backend.constants';

export default function Logo({ loading }: { loading?: boolean }) {
  const image = { uri: DEFAULT_ICON };
  return loading ? (
    <ActivityIndicator
      // hidesWhenStopped={true}
      animating={loading}
      style={styles.image}
    />
  ) : (
    <Image
      source={require('../../assets/logo.png')}
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
});
