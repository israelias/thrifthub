import React from "react";

import { useUserContext } from "./user.context";

import {
  deleteRequest,
  putRequest,
  getRequest,
  postRequest,
} from "../services/crud.service";

import { ProductStackNavigatorParamList } from "../types";

export type ProductParams = ProductStackNavigatorParamList["ProductDetails"];
/**
 * Third-level Context provider for all user-specific snipetts and collections data.
 * Relies on UserContext's username upon login to fetch user's data.
 *
 */

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
  error: "",
};

type ProductsDataType = {
  products: ProductParams[] | [] | undefined;
  loading: boolean;
  error: string | undefined;
  dispatch: React.Dispatch<FetchProductsAction>;
  loadProducts: () => Promise<void>;
};

const ProductsData = React.createContext<ProductsDataType>(undefined!);

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

  async function loadProducts() {
    dispatch({ type: ProductsActionTypes.fetchProducts });

    try {
      const response = await getRequest({
        url: `store?expand=product_images,vendor,product,category&include=vendor.name`,
      });
      const productsData = await response.json();
      dispatch({
        type: ProductsActionTypes.fetchProductsSuccess,
        products: productsData,
      });
    } catch (e) {
      dispatch({ type: ProductsActionTypes.fetchProductsFailure });
    }
  }

  React.useEffect(() => {
    loadProducts();
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
      }}
    >
      {children}
    </ProductsData.Provider>
  );
}

export const useProductsData = () => React.useContext(ProductsData);
