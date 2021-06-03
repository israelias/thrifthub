// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number;
  name: string;
};

export interface Category {
  name: string;
  slug: string;
}

export interface ProductImage {
  image: string | undefined;
  alt_text: string | undefined;
}

export interface Product {
  id: number;
  category: number;
  title: string;
  slug: string;
  regular_price: string;
  product_image: ProductImage[];
}
