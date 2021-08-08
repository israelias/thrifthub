import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RouteProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
// import { GestureResponderEvent } from "react-native";

// export type ProductParamList = {
//   Product: {
//     name: string;
//   };
//   ProductDetail: {
//     name: string;
//     submit?: React.MutableRefObject<() => void>;
//   };
// };

// export type AuthParamList = {
//   Login: undefined;
//   Register: undefined;
// };

// export type AuthNavProps<T extends keyof AuthParamList> = {
//   navigation: StackNavigationProp<AuthParamList, T>;
//   route: RouteProp<AuthParamList, T>;
// };

// export type HomeParamList = {
//   Landing: AuthParamList;
// } & ProductParamList;

// export type HomeStackNavProps<T extends keyof HomeParamList> = {
//   navigation: StackNavigationProp<HomeParamList, T>;
//   route: RouteProp<HomeParamList, T>;
// };

/**
 * Root Stack
 */
export type RootStackParamList = {
  Home: NavigatorScreenParams<AccountStackNavigatorParamList>;
  NotFound: undefined;
} & AccountStackNavigatorParamList &
  ProductStackNavigatorParamList;

/**
 * Auth Stack
 */
export type AccountStackNavigatorParamList = {
  StartScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type DrawerStackParamList = {
  Home: undefined;
} & BottomTabParamList &
  ProductStackNavigatorParamList;

export type BottomTabParamList = {
  Products: undefined;
  Transactions: undefined;
  Favorites: undefined;
  MyProducts: undefined;
  AddProduct: undefined;
};

/**
 * Products Home Stack
 */
export type ProductStackNavigatorParamList = {
  Products: undefined;
  ProductDetails: ProductTypeParamList;
  MakeOffer: {
    product: ProductTypeParamList;
  };
  MakePurchase: {
    product: ProductTypeParamList;
  };
  UpdateProduct: {
    product: ProductTypeParamList;
  };
};

export type ProductTypeParamList = {
  id: number;
  category: CategoryTypeParamList;
  vendor: VendorTypeParamList;
  title: string;
  description: string;
  slug: string;
  price: number;
  condition: string;
  is_available: boolean;
  image: ImageTypeParamList;
  created_at: string;
  updated_at: string;
  product_images: ProductImagesTypeParamList;
  similar_products: SimilarProductsTypeParamList;
};

export type AccountStackNavProps<
  T extends keyof AccountStackNavigatorParamList
> = {
  navigation: StackNavigationProp<AccountStackNavigatorParamList, T>;
  route: RouteProp<AccountStackNavigatorParamList, T>;
};

export type RootStackNavProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

export type SearchParamList = {
  Search: undefined;
} & ProductStackNavigatorParamList;

export type SearchStackNavProps<T extends keyof SearchParamList> = {
  navigation: StackNavigationProp<SearchParamList, T>;
  route: RouteProp<SearchParamList, T>;
};

export type CategoryTypeParamList = {
  id: number;
  name: string;
  slug: string;
};

export type ProductImagesTypeParamList = Array<{
  image: ImageTypeParamList;
}>;

export type ImageTypeParamList = {
  full_size: string;
  thumbnail: string;
};

export type SimilarProductsTypeParamList = Array<{
  id: number;
  category: string;
  vendor: string;
  title: string;
  slug: string;
  price: number;
  condition: string;
  is_available: boolean;
  image: ImageTypeParamList;
}>;

export type VendorTypeParamList = {
  id: number;
  name: string;
  online: boolean;
  image: ImageTypeParamList;
  products: ProductTypeParamList[];
  product_count: number;
  order_count: number;
  favorites: ProductTypeParamList[];
  friends: VendorTypeParamList[];
  friends_products: ProductTypeParamList[];
  order_requests: OrderTypeParamList[];
  orders_made: OrderTypeParamList[];
};

export type OrderTypeParamList = {
  id: number;
  product: ProductTypeParamList;
  vendor: VendorTypeParamList;
  buyer: VendorTypeParamList;
  status: string;
  amount: string;
  created_at: string;
  updated_at: string;
  order_detail: OrderDetailTypeParamList;
};

export type OrderTransactionStackParamList =
  | {
      Order: undefined;
      OrderDetails: OrderTypeParamList;
    }
  | Record<string, object | undefined>;

export type OrderDetailTypeParamList = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  country: string;
  zipcode: string;
  town_or_city: string;
  street_address1: string;
  street_address2: string;
  county: string;
  created_at: string;
  updated_at: string;
  stripe_pid: string;
};

export type AuthResponseType = {
  access: string;
  refresh: string;
  user: VendorTypeParamList;
};

export type AuthStackNavigationParamList = {
  SplashScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  Home: undefined;
};

export type FullStackParamLost = {
  Account: AccountStackNavigatorParamList;
  Store: ProductStackNavigatorParamList;
  // Account:
};
