import React from "react";

import { useUserContext } from "./user.context";

import {
  deleteRequest,
  putRequest,
  getRequest,
  postRequest,
} from "../services/crud.service";

import {
  getVendorData,
  getVendorFavorites,
  addFavorite,
  removeFavorite,
  makePurchase,
  makeOffer,
  acceptOffer,
  declineOffer,
  completePayment,
  createOrder,
  updateOrder,
} from "../services/get.service";

const VENDOR_FAVORITES_ENDPOINT = "vendor/<id>/favorites/</id>";
const VENDOR_PROFILE_ENDPOINT = "vendor/";

import {
  OrderTypeParamList,
  VendorTypeParamList,
  ProductTypeParamList,
} from "../types";

export type VendorParams = VendorTypeParamList;

/**
 * Third-level Context provider for all user-specific snipetts and collections data.
 * Relies on UserContext's username upon login to fetch user's data.
 *
 * @since 2021-04-08
 */

export enum VendorActionTypes {
  fetchVendor,
  fetchVendorSuccess,
  fetchVendorFailure,
  fetchVendorFaves,
  fetchVendorOrderRequests,
  fetchVendorOrdersMade,
}

export interface FetchVendorAction {
  type: VendorActionTypes;
  vendor?: VendorParams;
  favorites?: ProductTypeParamList;
  order_requests?: OrderTypeParamList;
  orders_made?: OrderTypeParamList;
  error?: object;
}

export interface StateInterface {
  vendor?: VendorParams;
  loading: boolean;
  error?: object;
}

const initialState: StateInterface = {
  vendor: undefined,
  loading: false,
  error: {},
};

type VendorDataType = {
  vendorFaves: ProductTypeParamList[] | [];
  vendorFavoritesFeed: ProductTypeParamList[] | [];
  // setVendorFaves: React.Dispatch<
  //   React.SetStateAction<VendorParams["favorites"] | []>
  // >;
  orderRequests: OrderTypeParamList[] | [];
  // setOrderRequests: React.Dispatch<
  //   React.SetStateAction<OrderTypeParamList[] | []>
  // >;
  ordersMade: OrderTypeParamList[] | [];
  // setOrdersMade: React.Dispatch<
  //   React.SetStateAction<OrderTypeParamList[] | []>
  // >;
  vendorProducts: ProductTypeParamList[] | [];
  // setVendorProducts: React.Dispatch<
  //   React.SetStateAction<ProductTypeParamList[] | []>
  // >;

  vendor: VendorParams | undefined;
  loading: boolean;
  error: {} | undefined;
  vendorId: string | undefined;
  setVendorId: React.Dispatch<React.SetStateAction<string | undefined>>;

  dispatch: React.Dispatch<FetchVendorAction>;
  // loadFavorites: () => Promise<void>;
  // loadOrderRequests: () => Promise<void>;
  // loadOrdersMade: () => Promise<void>;
  // loadProducts: () => Promise<void>;
  loadVendor: () => Promise<void>;
  loadVendorFaves(id: string): Promise<void>;
  loadVendorFavorites(id: string): Promise<void>;
};

const VendorData = React.createContext<VendorDataType>(undefined!);

export default function VendorDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vendorId, setVendorId] = React.useState<string | undefined>(
    undefined!
  );
  const [vendorProducts, setVendorProducts] = React.useState<
    ProductTypeParamList[] | []
  >([]);
  const [vendorFavoritesFeed, setVendorFavoritesFeed] = React.useState<
    ProductTypeParamList[] | []
  >([]);
  const [vendorFaves, setVendorFaves] = React.useState<
    VendorParams["favorites"] | []
  >([]);
  const [orderRequests, setOrderRequests] = React.useState<
    OrderTypeParamList[] | []
  >([]);
  const [ordersMade, setOrdersMade] = React.useState<OrderTypeParamList[] | []>(
    []
  );

  const [state, dispatch] = React.useReducer(
    (
      state: StateInterface,
      {
        type,
        vendor,
        favorites,
        order_requests,
        orders_made,
        error,
      }: FetchVendorAction
    ) => {
      switch (type) {
        case VendorActionTypes.fetchVendor:
          return { ...state, loading: true };

        case VendorActionTypes.fetchVendorSuccess:
          return { ...state, vendor, loading: false };

        case VendorActionTypes.fetchVendorFailure:
          return { ...state, error: error, loading: false };

        case VendorActionTypes.fetchVendorFaves:
          return {
            ...state,
            loading: false,
            favorites: favorites,
          };
        case VendorActionTypes.fetchVendorOrdersMade:
          return {
            ...state,
            orders_made: orders_made,
          };
        case VendorActionTypes.fetchVendorOrderRequests:
          return {
            ...state,
            order_requests: order_requests,
          };

        default:
          return state;
      }
    },
    initialState
  );

  async function loadVendor() {
    dispatch({ type: VendorActionTypes.fetchVendor });

    try {
      const response = await getRequest({ url: `vendor/${vendorId}` });
      const vendorData = await response.json();
      dispatch({
        type: VendorActionTypes.fetchVendorSuccess,
        vendor: vendorData,
      });
    } catch (e) {
      dispatch({ type: VendorActionTypes.fetchVendorFailure });
    }
  }

  const { vendor, loading, error } = state;

  async function loadVendorFavorites(id: string) {
    dispatch({ type: VendorActionTypes.fetchVendor });
    const response: ProductTypeParamList = await getVendorFavorites(id);
    if (response) {
      dispatch({
        type: VendorActionTypes.fetchVendorFaves,
        favorites: response,
      });
    }
  }

  async function loadVendorFaves(id: string) {
    const response = await getVendorFavorites(id);
    if (response) {
      setVendorFavoritesFeed(response);
    }
  }

  React.useEffect(() => {
    if (vendor && vendor.products.length > 0) {
      setVendorProducts(vendor.products);
    }
  }, [vendor]);

  React.useEffect(() => {
    if (vendor) {
      if (vendor.id) {
        setVendorId(vendor.id.toString());
      }
      if (vendor.order_requests.length > 0) {
        setOrderRequests(vendor.order_requests);
      }
      if (vendor.orders_made.length > 0) {
        setOrdersMade(vendor.orders_made);
      }
      if (vendor.products.length > 0) {
        setVendorProducts(vendor.products);
      }
      if (vendor.favorites.length > 0) {
        setVendorFaves(vendor.favorites);
      }
    }
  }, [vendor]);

  return (
    <VendorData.Provider
      value={{
        vendor,
        loading,
        error,
        dispatch,
        vendorId,
        setVendorId,
        loadVendor,
        orderRequests,
        ordersMade,
        vendorProducts,
        vendorFaves,
        loadVendorFaves,
        vendorFavoritesFeed,
        loadVendorFavorites,
      }}
    >
      {children}
    </VendorData.Provider>
  );
}

export const useVendorData = () => React.useContext(VendorData);
