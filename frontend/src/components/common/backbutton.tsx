import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DEFAULT_ICON } from '../../constants/backend.constants';

export default function BackButton({
  goBack,
}: {
  goBack: () => void;
}) {
  const image = { uri: DEFAULT_ICON };
  const backIcon = require('../../assets/arrow_back.png');
  return (
    <TouchableRipple onPress={goBack} style={styles.container}>
      <Image style={styles.image} source={backIcon} />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
});
