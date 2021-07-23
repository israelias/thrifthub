import React from "react";

import { useUserContext } from "./user.context";

import {
  deleteRequest,
  putRequest,
  getRequest,
  postRequest,
} from "../services/crud.service";

const VENDOR_FAVORITES_ENDPOINT = "vendor/<id>/favorites/</id>";
const VENDOR_PROFILE_ENDPOINT = "vendor/";

import { OrderTransactionStackParamList, VendorTypeParamList } from "../types";

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
}

export interface FetchVendorAction {
  type: VendorActionTypes;
  vendor?: VendorParams;
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
  // favorites: Product[] | [];
  // setFavorites: React.Dispatch<React.SetStateAction<Product[] | []>>;
  // orderRequests: Order[] | [];
  // setOrderRequests: React.Dispatch<React.SetStateAction<Order[] | []>>;
  // ordersMade: Order[] | [];
  // setOrdersMade: React.Dispatch<React.SetStateAction<Order[] | []>>;
  // products: Product[] | [];
  // setProducts: React.Dispatch<React.SetStateAction<Product[] | []>>;
  // image: ImagePreview | {};
  // setImage: React.Dispatch<React.SetStateAction<ImagePreview | {}>>;
  // setLoadingFaves: React.Dispatch<React.SetStateAction<boolean>>;
  // loadingVendor: boolean;
  // setLoadingVendor: React.Dispatch<React.SetStateAction<boolean>>;
  vendor: VendorParams | undefined;
  loading: boolean;
  error: {} | undefined;
  vendorId: string;
  setVendorId: React.Dispatch<React.SetStateAction<string>>;

  dispatch: React.Dispatch<FetchVendorAction>;
  // loadFavorites: () => Promise<void>;
  // loadOrderRequests: () => Promise<void>;
  // loadOrdersMade: () => Promise<void>;
  // loadProducts: () => Promise<void>;
  loadVendor: () => Promise<void>;
};

const VendorData = React.createContext<VendorDataType>(undefined!);

export default function VendorDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vendorId, setVendorId] = React.useState<string>("");

  // const [favorites, setFavorites] = React.useState<Product[] | []>([]);

  // const [orderRequests, setOrderRequests] = React.useState<Order[] | []>([]);

  // const [ordersMade, setOrdersMade] = React.useState<Order[] | []>([]);

  // const [products, setProducts] = React.useState<Product[] | []>([]);

  // const [image, setImage] = React.useState<ImagePreview | {}>({});

  // const [loadingVendor, setLoadingVendor] = React.useState<boolean>(false);

  const [state, dispatch] = React.useReducer(
    (state: StateInterface, { type, vendor, error }: FetchVendorAction) => {
      switch (type) {
        case VendorActionTypes.fetchVendor:
          return { ...state, loading: true };

        case VendorActionTypes.fetchVendorSuccess:
          return { ...state, vendor, loading: false };

        case VendorActionTypes.fetchVendorFailure:
          return { ...state, error: error, loading: false };

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

  // React.useEffect(() => {
  //   fetchVendor();
  // }, []);

  const { vendor, loading, error } = state;

  // const loadVendor = async () => {
  //   setLoadingVendor(true);
  //   const response = await getRequest({ url: `vendor/${userId}` });
  //   if (response) {
  //     setCollectionsProfile(response);
  //     setLoadingCollections(false);
  //   }
  // };

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
      }}
      // value={{
      //   favorites,
      //   setFavorites,
      //   orderRequests,
      //   setOrderRequests,
      //   ordersMade,
      //   setOrdersMade,
      //   products,
      //   setProducts,
      //   image,
      //   setImage,
      //   loadFavorites,
      //   loadOrderRequests,
      //   loadOrdersMade,
      //   loadProducts,
      // }}
    >
      {children}
    </VendorData.Provider>
  );
}

export const useVendorData = () => React.useContext(VendorData);
