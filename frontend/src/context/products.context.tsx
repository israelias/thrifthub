import React from 'react';

import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../services/crud.service';
import { getProducts, getCategories } from '../services/get.service';
import {
  ProductStackNavigatorParamList,
  CategoryTypeParamList,
} from '../types';
import { useUserContext } from './user.context';

export type ProductParams =
  ProductStackNavigatorParamList['ProductDetails'];

/**
 * Third-level Context provider for all user-specific snipetts and collections data.
 * Relies on UserContext's username upon login to fetch user's data.
 *
 */

export type Options = Array<{
  label: string;
  value: string | number;
}>;

export enum ProductsActionTypes {
  fetchProducts,
  fetchProductsSuccess,
  fetchProductsFailure,
}

export interface FetchProductsAction {
  type: ProductsActionTypes;
  products?: ProductParams[];
  error?: string;
}

export interface ProductsStateInterface {
  products?: ProductParams[] | [];
  loading: boolean;
  error?: string;
}

const initialState: ProductsStateInterface = {
  products: [],
  loading: false,
  error: '',
};

type ProductsDataType = {
  products: ProductParams[] | [] | undefined;
  loading: boolean;
  error: string | undefined;
  dispatch: React.Dispatch<FetchProductsAction>;
  loadProducts: () => Promise<void>;
  loadCategories: () => Promise<void>;
  categoryOptions: Options;
};

const ProductsData = React.createContext<ProductsDataType>(
  undefined!
);

export default function ProductsDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(
    (
      state: ProductsStateInterface,
      { type, products, error }: FetchProductsAction
    ) => {
      switch (type) {
        case ProductsActionTypes.fetchProducts:
          return { ...state, loading: true };

        case ProductsActionTypes.fetchProductsSuccess:
          return { ...state, products, loading: false };

        case ProductsActionTypes.fetchProductsFailure:
          return { ...state, error: error, loading: false };

        default:
          return state;
      }
    },
    initialState
  );

  const [categoryOptions, setCategoryOptions] =
    React.useState<Options>([{ label: 'Category', value: 0 }]);

  async function loadProducts() {
    dispatch({ type: ProductsActionTypes.fetchProducts });

    const data = await getProducts();

    if (data) {
      dispatch({
        type: ProductsActionTypes.fetchProductsSuccess,
        products: data,
      });
    } else {
      dispatch({ type: ProductsActionTypes.fetchProductsFailure });
    }
  }

  async function loadCategories() {
    const data = await getCategories();
    if (data) {
      setCategoryOptions(
        data.map((category: CategoryTypeParamList) => ({
          label: category.name,
          value: category.id,
        }))
      );
    }
  }

  React.useEffect(() => {
    loadProducts();
  }, []);

  React.useEffect(() => {
    loadCategories();
  }, []);

  const { products, loading, error } = state;

  return (
    <ProductsData.Provider
      value={{
        products,
        loading,
        error,
        dispatch,
        loadProducts,
        loadCategories,
        categoryOptions,
      }}
    >
      {children}
    </ProductsData.Provider>
  );
}

export const useProductsData = () => React.useContext(ProductsData);
