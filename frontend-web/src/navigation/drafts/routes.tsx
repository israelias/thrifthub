// import { ProductParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type ProductParamList = {
  Product: {
    name: string;
  };
  EditProduct: {
    name: string;
    submit?: React.MutableRefObject<() => void>;
  };
};

export type SearchParamList = {
  Search: undefined;
} & ProductParamList;

export type SearchStackNavProps<T extends keyof SearchParamList> = {
  navigation: StackNavigationProp<SearchParamList, T>;
  route: RouteProp<SearchParamList, T>;
};

export type AuthParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthNavProps<T extends keyof AuthParamList> = {
  navigation: StackNavigationProp<AuthParamList, T>;
  route: RouteProp<AuthParamList, T>;
};

export type HomeParamList = {
  Feed: undefined;
} & ProductParamList;

export type HomeStackNavProps<T extends keyof HomeParamList> = {
  navigation: StackNavigationProp<HomeParamList, T>;
  route: RouteProp<HomeParamList, T>;
};
