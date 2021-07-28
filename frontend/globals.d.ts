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
  image: ImagePreview;
  products: Product[];
  favorites: Product[];
  friends: Vendor[];
  friends_products: Product[];
  order_requests: Order[];
  orders_made: Order[];
  product_count: boolean;
  order_count: boolean;
  online: boolean;
};

type VendorPreview = {
  id: number;
  name: string;
  online: boolean;
  image: ImagePreview;
  product_count: number;
  order_count: number;
  favorites: Product["slug"][];
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

type CategoryPreview = {
  id: number;
  name: string;
  slug: string;
};

type Product = {
  id: number;
  category: CategoryPreview;
  vendor: VendorPreview;
  title: string;
  description: string;
  slug: string;
  price: number;
  condition: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  image: ImagePreview;
  product_images: Image[];
  similar_products: Product[];
};

type ProductPreview = {
  id: number;
  category: Category["name"];
  vendor: VendorPreview;
  title: string;
  description: string;
  slug: string;
  price: number;
  condition: string;
  is_available: boolean;
  image: ImagePreview;
  created_at: string;
  updated_at: string;
  similar_products: ProductPreview[];
};

type ProductDetail = {
  id: number;
  category: Category["name"];
  vendor: VendorPreview;
  title: string;
  description: string;
  slug: string;
  price: number;
  condition: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  image: Image;
  product_images?: Image[];
  similar_products: ProductPreview[];
};

type Image = {
  id?: number;
  name?: string;
  image: ImagePreview;
  alt_text: string;
  is_feature: boolean;
  created_at?: string;
  updated_at?: string;
  product?: Product["id"];
};

type ImagePreview = {
  full_size: string;
  thumbnail: string;
};

type Order = {
  id: number;
  product: ProductPreview;
  vendor: VendorPreview;
  buyer: VendorPreview;
  status: string;
  amount?: string;
  created_at?: string;
  updated_at?: string;
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

type AccessToken = {
  accessToken: null | string;
};
