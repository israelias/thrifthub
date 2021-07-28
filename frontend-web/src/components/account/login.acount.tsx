import React from "react";
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";

import {
  Box,
  Divider,
  Wrap,
  useBreakpointValue,
  useMediaQuery,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  Text,
} from "native-base";

import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import Animated, { Extrapolate } from "react-native-reanimated";

import { useUserContext } from "../../context/user.context";

export default function LoginComponent() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    returning,
    setReturning,
  } = useUserContext();

  const [products, setProducts] = React.useState<Product[] | undefined>();
  const [loading, setLoading] = React.useState(false);

  const [direction, setDirection] = React.useState<"column" | "row">("column");

  const [isLargerThan512] = useMediaQuery({ minWidth: 512 });

  const onEmailChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    const value = event.nativeEvent.text;
    if (value === "") {
      setEmail("");
    }
    setEmail(value);
  };

  const onPasswordChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    const value = event.nativeEvent.text;
    if (value === "") {
      setPassword("");
    }
    setPassword(value);
  };

  return (
    <Box flex={1} p={2} w="90%" mx="auto">
      <Heading size="lg" color="primary.500">
        Welcome
      </Heading>
      <Heading color="muted.400" size="xs">
        {returning ? "Sign in to continue!" : " Sign up to continue!"}
      </Heading>

      <VStack space={2} mt={5}>
        <FormControl>
          <FormControl.Label
            _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
          >
            Username
          </FormControl.Label>
          <Input
            type="text"
            value={username}
            onChangeText={(email) => setEmail(email)}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label
            _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
          >
            Email
          </FormControl.Label>
          <Input
            type="text"
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label
            _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
          >
            Password
          </FormControl.Label>
          <Input type="password" value={password} onChange={onPasswordChange} />
        </FormControl>
        <VStack space={2} mt={5}>
          <Button colorScheme="cyan" _text={{ color: "white" }}>
            {returning ? "SignIn" : "SignUp"}
          </Button>

          <HStack justifyContent="center" alignItems="center">
            <IconButton
              variant="unstyled"
              icon={
                <Icon
                  as={<MaterialCommunityIcons name="facebook" />}
                  color="muted.700"
                  size="sm"
                />
              }
              // startIcon={
              //   <Icon
              //     as={<MaterialCommunityIcons name="facebook" />}
              //     color="muted.700"
              //     size="sm"
              //   />
              // }
            />
            <IconButton
              variant="unstyled"
              icon={
                <Icon
                  as={<MaterialCommunityIcons name="google" />}
                  color="muted.700"
                  size="sm"
                />
              }
            />
            <IconButton
              variant="unstyled"
              icon={
                <Icon
                  as={<MaterialCommunityIcons name="github" />}
                  color="muted.700"
                  size="sm"
                />
              }
            />
          </HStack>
        </VStack>
        <HStack justifyContent="center">
          <Text fontSize="sm" color="muted.700" fontWeight={400}>
            {returning ? "I have an account." : "I'm a new user."}
          </Text>
          {/* <Link
              _text={{ color: "cyan.500", bold: true, fontSize: "sm" }}
              href="#"
            >
              Sign Up
            </Link> */}
          <Button
            variant="unstyled"
            _text={{ color: "cyan.500", bold: true, fontSize: "sm" }}
            onPress={() => setReturning(!returning)}
            // onClick={}
          >
            {returning ? "Sign In" : "Sign Up"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
