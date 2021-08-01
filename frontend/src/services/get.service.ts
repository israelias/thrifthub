import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from './crud.service';

import * as BACKEND from '../constants/backend.constants';

// STORE
export function getCategories() {
  return getRequest({ url: BACKEND.CATEGORY_ENDPOINT });
}

export function getProducts() {
  return getRequest({
    url: BACKEND.HOME_PRODUCTS_QUERY,
  });
}

export function getProductsByCategory(slug: string) {
  return getRequest({
    url: `${BACKEND.PRODUCT_ENDPONT}/${BACKEND.CATEGORY_ENDPOINT}/${slug}`,
  });
}

export function getProductsByVendor(slug: string) {
  return getRequest({
    url: `${BACKEND.PRODUCT_ENDPONT}/${BACKEND.VENDOR_ENDPOINT}/${slug}`,
  });
}

export function searchProducts(query: string) {
  return getRequest({
    url: `${BACKEND.PRODUCT_ENDPONT}/?search=${query}`,
  });
}

export function getProduct(slug: string) {
  return getRequest({ url: `${BACKEND.PRODUCT_ENDPONT}/${slug}` });
}

export function createProduct(
  vendor: number,
  title: string,
  category: number,
  description: string,
  price: string,
  condition: number,
  accessToken: AccessToken['accessToken'],
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
  accessToken: AccessToken['accessToken'],
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
    url: `${BACKEND.PRODUCT_ENDPONT}/${slug}`,
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
  return deleteRequest({
    url: `${BACKEND.PRODUCT_ENDPONT}/${slug}`,
    accessToken,
  });
}

// VENDOR
export function getVendors() {
  return getRequest({ url: BACKEND.VENDOR_ENDPOINT });
}

export function getVendorData(id: string) {
  return getRequest({ url: `${BACKEND.VENDOR_ENDPOINT}/${id}` });
}

export function getVendorFavorites(id: string) {
  return getRequest({
    url: `${BACKEND.VENDOR_ENDPOINT}/${id}/favorites`,
  });
}

export function addFavorite(
  id: string,
  product_id: string,
  accessToken: AccessToken['accessToken']
) {
  return postRequest({
    url: `${BACKEND.VENDOR_ENDPOINT}/${id}/favorites`,
    body: { product_id },
    accessToken,
  });
}

export function removeFavorite(
  id: string,
  product_id: string,
  accessToken: AccessToken['accessToken']
) {
  return deleteRequest({
    url: `${BACKEND.VENDOR_ENDPOINT}/${id}/favorites`,
    body: { product_id },
    accessToken,
  });
}

export function getVendorFriends(id: string) {
  return getRequest({
    url: `${BACKEND.VENDOR_ENDPOINT}/${id}/friends`,
  });
}

// ORDERS
export function getOrders() {
  return getRequest({ url: `${BACKEND.ORDER_ENDPOINT}` });
}

export function makePurchase(
  product: string,
  buyer: string,
  accessToken: AccessToken['accessToken']
) {
  return postRequest({
    url: BACKEND.ORDER_ENDPOINT,
    body: { product, buyer },
    accessToken,
  });
}

export function makeOffer(
  product: string,
  buyer: string,
  amount: string,
  accessToken: AccessToken['accessToken']
) {
  return postRequest({
    url: BACKEND.ORDER_ENDPOINT,
    body: { product, buyer, amount },
    accessToken,
  });
}

export function acceptOffer(
  id: string,
  product: string,
  buyer: string,
  accessToken: AccessToken['accessToken']
) {
  return putRequest({
    url: `${BACKEND.ORDER_ENDPOINT}/${id}`,
    body: { product, buyer, status: 'ACCEPTED' },
    accessToken,
  });
}

export function declineOffer(
  id: string,
  product: string,
  buyer: string,
  accessToken: AccessToken['accessToken']
) {
  return putRequest({
    url: `${BACKEND.ORDER_ENDPOINT}/${id}`,
    body: { product, buyer, status: 'DENIED' },
    accessToken,
  });
}

export function completePayment(
  id: string,
  product: string,
  buyer: string,
  accessToken: AccessToken['accessToken']
) {
  return putRequest({
    url: `${BACKEND.ORDER_ENDPOINT}/${id}`,
    body: { product, buyer, status: 'COMPLETED' },
    accessToken,
  });
}

export function updateOrder(
  id: string,
  product: string,
  buyer: string,
  accessToken: AccessToken['accessToken'],
  amount?: string,
  status?: string
) {
  return putRequest({
    url: `${BACKEND.ORDER_ENDPOINT}/${id}`,
    body: { product, buyer, status, amount },
    accessToken,
  });
}

export function createOrder(
  product: string,
  buyer: string,
  accessToken: AccessToken['accessToken'],
  amount?: string
) {
  return postRequest({
    url: BACKEND.ORDER_ENDPOINT,
    body: { product, buyer, amount },
    accessToken,
  });
}

export function deleteOrder(
  id: string,
  accessToken: AccessToken['accessToken']
) {
  return deleteRequest({
    url: `${BACKEND.ORDER_ENDPOINT}/${id}`,
    accessToken,
  });
}

export function getOrderDetail(id: string) {
  return getRequest({ url: `${BACKEND.ORDERDETAILS_ENDPONT}/${id}` });
}

export function createOrderDetail(
  accessToken: AccessToken['accessToken'],
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
    url: BACKEND.ORDERDETAILS_ENDPONT,
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
  accessToken: AccessToken['accessToken'],
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
    url: `${BACKEND.ORDERDETAILS_ENDPONT}/${id}`,
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
