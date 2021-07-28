import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "./crud.service";

// STORE
export function getCategories() {
  return getRequest({ url: `category` });
}

export function getProducts() {
  return getRequest({ url: `store` });
}

export function getProductsByCategory(slug: string) {
  return getRequest({ url: `store/category/${slug}` });
}

export function getProductsByVendor(slug: string) {
  return getRequest({ url: `store/vendor/${slug}` });
}

export function searchProducts(query: string) {
  return getRequest({ url: `store/?search=${query}` });
}

export function getProduct(slug: string) {
  return getRequest({ url: `store/${slug}` });
}

export function createProduct(
  vendor: number,
  title: string,
  category: number,
  description: string,
  price: string,
  condition: number,
  accessToken: AccessToken["accessToken"],
  image?: string,
  slug?: string
) {
  return postRequest({
    url: `store`,
    body: {
      title,
      vendor,
      category,
      description,
      slug,
      price,
      condition,
      image,
    },
    accessToken,
  });
}

export function updateProduct(
  accessToken: AccessToken["accessToken"],
  slug: string,
  vendor: string,
  title?: string,
  category?: string,
  description?: string,
  price?: string,
  condition?: string,
  images?: string
) {
  return putRequest({
    url: `store/${slug}`,
    body: {
      title,
      vendor,
      category,
      description,
      slug,
      price,
      condition,
      images,
    },
    accessToken,
  });
}

export function deleteProduct(slug: string, accessToken: string) {
  return deleteRequest({ url: `store/${slug}`, accessToken });
}

// VENDOR
export function getVendors() {
  return getRequest({ url: `vendor` });
}

export function getVendorData(id: string) {
  return getRequest({ url: `vendor/${id}` });
}

export function getVendorFavorites(id: string) {
  return getRequest({ url: `vendor/${id}/favorites` });
}

export function addFavorite(
  id: string,
  product_id: string,
  accessToken: AccessToken["accessToken"]
) {
  return postRequest({
    url: `vendor/${id}/favorites`,
    body: { product_id },
    accessToken,
  });
}

export function removeFavorite(
  id: string,
  product_id: string,
  accessToken: AccessToken["accessToken"]
) {
  return deleteRequest({
    url: `vendor/${id}/favorites`,
    body: { product_id },
    accessToken,
  });
}

export function getVendorFriends(id: string) {
  return getRequest({ url: `vendor/${id}/friends` });
}

// ORDERS
export function getOrders() {
  return getRequest({ url: `orders` });
}

export function makePurchase(
  product: string,
  buyer: string,
  accessToken: AccessToken["accessToken"]
) {
  return postRequest({
    url: `orders`,
    body: { product, buyer },
    accessToken,
  });
}

export function makeOffer(
  product: string,
  buyer: string,
  amount: string,
  accessToken: AccessToken["accessToken"]
) {
  return postRequest({
    url: `orders`,
    body: { product, buyer, amount },
    accessToken,
  });
}

export function acceptOffer(
  id: string,
  product: string,
  buyer: string,
  accessToken: AccessToken["accessToken"]
) {
  return putRequest({
    url: `orders/${id}`,
    body: { product, buyer, status: "ACCEPTED" },
    accessToken,
  });
}

export function declineOffer(
  id: string,
  product: string,
  buyer: string,
  accessToken: AccessToken["accessToken"]
) {
  return putRequest({
    url: `orders/${id}`,
    body: { product, buyer, status: "DENIED" },
    accessToken,
  });
}

export function completePayment(
  id: string,
  product: string,
  buyer: string,
  accessToken: AccessToken["accessToken"]
) {
  return putRequest({
    url: `orders/${id}`,
    body: { product, buyer, status: "COMPLETED" },
    accessToken,
  });
}

export function updateOrder(
  id: string,
  product: string,
  buyer: string,
  accessToken: AccessToken["accessToken"],
  amount?: string,
  status?: string
) {
  return putRequest({
    url: `orders/${id}`,
    body: { product, buyer, status, amount },
    accessToken,
  });
}

export function createOrder(
  product: string,
  buyer: string,
  accessToken: AccessToken["accessToken"],
  amount?: string
) {
  return postRequest({
    url: `orders`,
    body: { product, buyer, amount },
    accessToken,
  });
}

export function deleteOrder(id: string, accessToken: string) {
  return deleteRequest({
    url: `orders/${id}`,
    accessToken,
  });
}

export function getOrderDetail(id: string) {
  return getRequest({ url: `orderdetail/${id}` });
}

export function createOrderDetail(
  accessToken: AccessToken["accessToken"],
  order: string,
  full_name: string,
  email: string,
  phone_number: string,
  country: string,
  town_or_city: string,
  street_address1: string,
  street_address2?: string,
  county?: string,
  stripe_pid?: string,
  zipcode?: string
) {
  return postRequest({
    url: `orderdetail`,
    body: {
      order,
      full_name,
      email,
      phone_number,
      country,
      town_or_city,
      street_address1,
      street_address2,
      county,
      zipcode,
      stripe_pid,
    },
    accessToken,
  });
}

export function updateOrderDetail(
  id: string,
  accessToken: AccessToken["accessToken"],
  order: string,
  full_name?: string,
  email?: string,
  phone_number?: string,
  country?: string,
  town_or_city?: string,
  street_address1?: string,
  street_address2?: string,
  county?: string,
  stripe_pid?: string,
  zipcode?: string
) {
  return putRequest({
    url: `orderdetail/${id}`,
    body: {
      order,
      full_name,
      email,
      phone_number,
      country,
      town_or_city,
      street_address1,
      street_address2,
      county,
      zipcode,
      stripe_pid,
    },
    accessToken,
  });
}
