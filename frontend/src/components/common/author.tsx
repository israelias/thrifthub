import { useScrollToTop, useTheme } from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import {
  Image,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Subheading,
  Text,
} from 'react-native-paper';

const Author = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, styles.attribution]}>
      <Avatar.Image
        source={require('../../assets/avatar-1.png')}
        size={32}
      />
      <Subheading style={styles.author}>Joke bot</Subheading>
    </View>
  );
};

const Footer = () => {
  return (
    <View style={styles.row}>
      <IconButton
        style={styles.icon}
        size={16}
        icon="heart-outline"
      />
      <IconButton
        style={styles.icon}
        size={16}
        icon="comment-outline"
      />
      <IconButton
        style={styles.icon}
        size={16}
        icon="share-outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 16,
    backgroundColor: 'transparent',
    margin: 0,
  },
  card: {
    marginVertical: 8,
    borderRadius: 0,
  },
  cover: {
    height: 160,
    borderRadius: 0,
  },
  content: {
    marginBottom: 12,
  },
  attribution: {
    margin: 12,
  },
  author: {
    marginHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
  },
});
