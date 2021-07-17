/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type User = {
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  last_login?: string;
  date_joined?: string;
};

export type Vendor = {
  id: number;
  name: string;
  slug: string;
  created_by: User;
  orders: Order[];
  products: Product[];
  favorites: Product[];
  cart?: Product[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  lft: number;
  rght: number;
  tree_id: number;
  level: number;
  parent_id: number;
};

export type Product = {
  id: number;
  category: Category["name"];
  vendor: Vendor["name"];
  title: string;
  description: string;
  slug: string;
  price: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  product_images: Image[];
  similiar_products?: Product[];
};

export type Image = {
  id: number;
  product: Product["id"];
  name: string;
  image: string;
  alt_text: string;
  is_feature: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderDetail = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  zip: string;
  country: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: number;
  product: Product["id"];
  vendor: Vendor["id"];
  buyer: Vendor["id"];
  paid: boolean;
  created_at: string;
  order_details: OrderDetail;
};

export type RootStackParamList = {
  Root: undefined;
  Home: undefined;
  Feed: { sort: "latest" | "top" } | undefined;
  Profile: { userId: string };
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};
