import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { GestureResponderEvent } from "react-native";

export type ProductStackNavigatorParamList = {
  Products: undefined;
  ProductDetails: {
    id: number;
    category: {
      id: number;
      name: string;
      slug: string;
    };
    // vendor: {
    //   id: number;
    //   name: string;
    //   online: boolean;
    //   image: {
    //     full_size: string;
    //     thumbnail: string;
    //   };
    //   product_count: number;
    //   order_count: number;
    //   favorites: {
    //     id: number;
    //     category: string;
    //     vendor: string;
    //     title: string;
    //     slug: string;
    //     price: number;
    //     condition: string;
    //     is_available: boolean;
    //     image: {
    //       full_size: string;
    //       thumbnail: string;
    //     };
    //   }[];
    // };
    vendor: VendorTypeParamList;
    title: string;
    description: string;
    slug: string;
    price: number;
    condition: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
    image: {
      full_size: string;
      thumbnail: string;
    };
    product_images: {
      image: {
        full_size: string;
        thumbnail: string;
      };
      // alt_text: string;
      // is_feature: boolean;
    }[];
    similar_products: {
      id: number;
      category: string;
      vendor: string;
      title: string;
      slug: string;
      price: number;
      condition: string;
      is_available: boolean;
      image: {
        full_size: string;
        thumbnail: string;
      };
    }[];
  };
};

type CategoryTypeParamList = {
  id: number;
  name: string;
  slug: string;
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
  image: {
    full_size: string;
    thumbnail: string;
  };
  created_at: string;
  updated_at: string;
  product_images: {
    image: {
      full_size: string;
      thumbnail: string;
    };
  }[];
  similar_products: {
    id: number;
    category: string;
    vendor: string;
    title: string;
    slug: string;
    price: number;
    condition: string;
    is_available: boolean;
    image: {
      full_size: string;
      thumbnail: string;
    };
  }[];
};

export type VendorTypeParamList = {
  id: number;
  name: string;
  online: boolean;
  image: {
    full_size: string;
    thumbnail: string;
  };
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

type Order = {
  id: number;
  product: ProductPreview;
  vendor: VendorPreview;
  buyer: VendorPreview;
  status: string;
  amount?: string;
  created_at?: string;
  updated_at?: string;
  order_detail?: OrderDetailTypeParamList;
};

type OrderDetailTypeParamList = {
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

export type AccountStackNavigatorParamList = {
  StartScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  Dashboard: undefined;
  ResetPassword: undefined;
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

export type ProductParamList = {
  Product: {
    name: string;
  };
  ProductDetail: {
    name: string;
    submit?: React.MutableRefObject<() => void>;
  };
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
  Landing: AuthParamList;
} & ProductParamList;

export type HomeStackNavProps<T extends keyof HomeParamList> = {
  navigation: StackNavigationProp<HomeParamList, T>;
  route: RouteProp<HomeParamList, T>;
};
