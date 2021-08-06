// Example of Animated Splash Screen in React Native
// https://aboutreact.com/animated-splash-screen/

// import React in our code
import React from 'react';

// import all the components we are going to use
// https://snack.expo.dev/embedded/@aboutreact/animated-splash-screen-example-?iframeId=h1ftiunob9&preview=true&platform=ios&theme=dark
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';

import { useTheme } from 'react-native-paper';

export const Splash = ({ isVisible }: { isVisible: boolean }) => {
  const theme = useTheme();
  const [align, setAlign] = React.useState<
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined
  >('center');

  const [alignsecond, setAlignsecond] =
    React.useState<boolean>(false);

  const [spinAnim, setSpinAnim] = React.useState(
    new Animated.Value(0)
  );

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  setTimeout(() => {
    setAlign('flex-start'), setAlignsecond(true);
  }, 2000);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  });

  React.useEffect(() => {
    if (!isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 6000,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isVisible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          justifyContent: 'center',
          opacity: fadeAnim,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <Animated.Image
        source={{
          uri: require('../../assets/logo@2x.png'),
        }}
        style={{
          width: 100,
          height: 100,
          transform: [{ rotate: spin }],
        }}
      />
      {!alignsecond ? null : (
        <View style={{ margin: 10, justifyContent: align }}>
          <Text
            style={{
              color: '#114998',
              fontSize: 30,
              fontWeight: 'bold',
              fontFamily: 'space-mono',
            }}
          >
            ThriftHub
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 40,
  },
});
