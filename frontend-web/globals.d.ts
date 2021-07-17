type User = {
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  last_login?: string;
  date_joined?: string;
};

type Vendor = {
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

type Category = {
  id: number;
  name: string;
  slug: string;
  lft: number;
  rght: number;
  tree_id: number;
  level: number;
  parent_id: number;
};

type Product = {
  id: number;
  category: Category;
  vendor: Vendor;
  title: string;
  description: string;
  slug: string;
  price: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  product_images: Image[];
  similiar_products?: Product[];
};

type Image = {
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

type Order = {
  id: number;
  product: Product["id"];
  vendor: Vendor["id"];
  buyer: Vendor["id"];
  status: string;
  amount?: string;
  created_at?: string;
  order_detail?: OrderDetail;
};

type OrderDetail = {
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

type AuthResponse = {
  access: string;
  refresh: string;
  user: Vendor;
};
