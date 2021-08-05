import {
  postFormData,
  putFormData,
  deleteFormData,
} from './formdata.service';

import * as BACKEND from '../constants/backend.constants';

export function createProduct(
  vendor: string,
  title: string,
  category: string,
  description: string,
  price: string,
  condition: string,
  accessToken: AccessToken['accessToken'],
  images?: FileList
) {
  const data = new FormData();
  data.append('vendor', vendor);
  data.append('title', title);
  data.append('description', description);
  data.append('price', price);
  data.append('condition', condition);
  data.append('category', category);
  if (images) {
    Array.from(images).forEach(function (image) {
      data.append('images', image, image.name);
    });
  }
  return postFormData({
    url: `store`,
    body: data,
    accessToken,
  });
}

export function updateProduct(
  slug: string,
  vendor: string,
  title: string,
  category: string,
  description: string,
  price: string,
  condition: string,
  accessToken: AccessToken['accessToken'],
  images?: FileList
) {
  const data = new FormData();
  data.append('vendor', vendor);
  data.append('title', title);
  data.append('description', description);
  data.append('price', price);
  data.append('condition', condition);
  data.append('category', category);
  if (images) {
    Array.from(images).forEach(function (image) {
      data.append('images', image, image.name);
    });
  }
  return putFormData({
    url: `${BACKEND.PRODUCT_ENDPONT}/${slug}`,
    body: data,
    accessToken,
  });
}
