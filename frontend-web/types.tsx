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
  created_at: string;
  created_by: User;
  products: Product[];
  favorites: Product[];
  friends: Vendor[];
  friends_products: Product[];
  order_requests: Order[];
  orders_made: Order[];
  online?: boolean;
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
  category: Category["id"];
  vendor: Vendor["id"];
  title: string;
  description: string;
  slug: string;
  price: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  product_images?: Image[];
  similiar_products?: Product[];
};

export type Image = {
  id?: number;
  name?: string;
  image: {
    full_size: string;
    thumbnail: string;
  };
  alt_text: string;
  is_feature: boolean;
  created_at?: string;
  updated_at?: string;
  product?: Product["id"];
};

export type Order = {
  id: number;
  product: Product["id"];
  vendor: Vendor["id"];
  buyer: Vendor["id"];
  status: string;
  amount?: string;
  created_at?: string;
  order_detail?: OrderDetail;
};

export type OrderDetail = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  country: string;
  zipcode?: string;
  town_or_city: string;
  street_address1: string;
  street_address2?: string;
  county?: string;
  created_at?: string;
  updated_at?: string;
  stripe_pid?: string;
  order?: Order["id"];
};

export type AuthResponse = {
  access: string;
  refresh: string;
  user: Vendor;
};

//  full_name = models.CharField(max_length=50, null=False, blank=False)
//     email = models.EmailField(max_length=254, null=False, blank=False)
//     phone_number = models.CharField(max_length=20, null=False, blank=False)
//     country = CountryField(blank_label="Country *", null=False, blank=False)
//     zipcode = models.CharField(max_length=20, null=True, blank=True)
//     town_or_city = models.CharField(max_length=40, null=False, blank=False)
//     street_address1 = models.CharField(max_length=80, null=False, blank=False)
//     street_address2 = models.CharField(max_length=80, null=True, blank=True)
//     county = models.CharField(max_length=80, null=True, blank=True)

//     created_at = models.DateTimeField(auto_now_add=True)

//     stripe_pid = models.CharField(max_length=254, null=False, blank=False, default="")

//     order = models.ForeignKey(Order, related_name="order_detail", on_delete=models.CASCADE)

export type RootStackParamList = {
  Root: undefined;
  Home: undefined;
  Feed: { sort: "latest" | "top" } | undefined;
  Profile: { userId: string };
  NotFound: undefined;
};

export type LandingStackParamList = {
  Home: undefined;
  Details: undefined;
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
