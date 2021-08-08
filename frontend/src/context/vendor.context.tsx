import React from 'react';
import { View } from 'react-native';

import {
  updateProduct,
  createProduct,
} from '../services/products.service';

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
  createOrderDetail,
  updateOrderDetail,
} from '../services/get.service';

import { Toast } from '../components/common/toast';

import { useProductsData } from './products.context';

import {
  OrderTypeParamList,
  VendorTypeParamList,
  ProductTypeParamList,
} from '../types';

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
  vendor: VendorParams | undefined;
  loading: boolean;
  error: {} | undefined;
  vendorId: string | undefined;

  addVendorFavorite: (
    product_id: string,
    accessToken: string
  ) => Promise<void>;
  removeVendorFavorite: (
    product_id: string,
    accessToken: string
  ) => Promise<void>;
  makeOffer: (
    product: string,
    amount: string,
    accessToken: string
  ) => Promise<void>;
  makePurchase: (
    product: string,
    accessToken: string
  ) => Promise<void>;
  acceptOffer: (
    orderId: string,
    product: string,
    buyer: string,
    accessToken: string
  ) => Promise<void>;
  declineOffer: (
    orderId: string,
    product: string,
    buyer: string,
    accessToken: string
  ) => Promise<void>;
  completePayment: (
    orderId: string,
    product: string,
    buyer: string,
    accessToken: string
  ) => Promise<void>;
  createProduct: (
    title: string,
    category: string,
    description: string,
    price: string,
    condition: string,
    accessToken: string,
    images?: FileList | undefined
  ) => Promise<void>;
  updateProduct: (
    slug: string,
    title: string,
    category: string,
    description: string,
    price: string,
    condition: string,
    accessToken: string,
    images?: FileList | undefined
  ) => Promise<void>;
  state: StateInterface;
  dispatch: React.Dispatch<FetchVendorAction>;
  loadVendorData(id: string): Promise<void>;
};

const VendorData = React.createContext<VendorDataType>(undefined!);

export default function VendorDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadProducts } = useProductsData();
  const [vendorId, setVendorId] = React.useState<string | undefined>(
    undefined!
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

  async function loadVendorFavorites(id: string) {
    const response: ProductTypeParamList = await getVendorFavorites(
      id
    );
    if (response) {
      console.log('VendorDispatch: Favorites reloaded', response);
      dispatch({
        type: VendorActionTypes.fetchVendorFaves,
        favorites: response,
      });
    }
  }

  async function loadVendorData(id: string) {
    dispatch({ type: VendorActionTypes.fetchVendor });
    const response: VendorParams = await getVendorData(id);
    if (response) {
      console.log('VendorDispatch: Vendor data reloaded', response);
      dispatch({
        type: VendorActionTypes.fetchVendorSuccess,
        vendor: response,
      });
    }
  }

  const { vendor, loading, error } = state;

  React.useEffect(() => {
    if (state.vendor) {
      setVendorId(state.vendor.id.toString());
    }
  }, [state]);

  console.log('currentVendorId', vendorId);

  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [message, setMessage] = React.useState<string | any>('');

  const onSuccess = (text: string | any) => {
    setMessage(text);
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
      setMessage('');
    }, 2500);
  };
  const onWarning = (text: string | any) => {
    setMessage(text);
    setOpenWarning(true);
    setTimeout(() => {
      setOpenWarning(false);
      setMessage('');
    }, 2500);
  };
  const onError = (text: string | any) => {
    setMessage(text);
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
      setMessage('');
    }, 2500);
  };

  console.log('Vendor Context Render');

  const vendorContextValue = React.useMemo(
    () => ({
      addVendorFavorite: async (
        product_id: string,
        accessToken: string
      ) => {
        const ID = vendorId || vendor?.id.toString() || '';
        console.group('Vendor Provider: adding favorite');
        /**
         * If credentials are validated...
         */
        if (product_id !== undefined && accessToken !== undefined) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log('Fetching with', ID, product_id, accessToken);
          /**
           * Fetch add favorite to backend with credentials.
           */
          await addFavorite(ID, product_id, accessToken).then(
            (response) => {
              /**
               * If status is ~200/successful...
               */
              if (response.ok) {
                /**
                 * Serialize the payload from backend.
                 */
                response.json().then((data) => {
                  /**
                   * Ensure there's data in the payload.
                   */
                  if (data) {
                    /**
                     * Dispatch that sign in was a success
                     */
                    console.log(
                      'Vendor Provider: Add favorite success message',
                      data.message
                    );
                    /**
                     * Display a snackbar message
                     */
                    onSuccess(data.message);
                    /**
                     * Reload vendor data
                     */
                    console.log('vendorId in request add', vendorId);
                    loadVendorData(ID);
                  }
                });
              } else {
                /**
                 * Dispatch that sign in was a success
                 */
                console.warn(
                  'Vendor Provider: Add favorite failed message',
                  response
                    .json()
                    .then((data) =>
                      data ? JSON.parse(data) : 'Request Failed'
                    )
                );
                /**
                 * Display warning message
                 */
                onWarning(
                  response
                    .json()
                    .then((data) =>
                      data ? JSON.parse(data) : 'Request Failed'
                    )
                );
              }
            }
          );
        } else {
          console.warn('Vendor Provider: Credetials error');
          /**
           * Display error message
           */
          onError('Request Failed');
        }
        console.groupEnd();
      },

      removeVendorFavorite: async (
        product_id: string,
        accessToken: string
      ) => {
        const ID = vendorId || vendor?.id.toString() || '';
        console.group('Vendor Provider: removing favorite');
        /**
         * If credentials are validated...
         */
        if (product_id !== undefined && accessToken !== undefined) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log('Fetching with', ID, product_id, accessToken);
          /**
           * Fetch add favorite to backend with credentials.
           */
          await removeFavorite(ID, product_id, accessToken).then(
            (response) => {
              /**
               * If status is ~200/successful...
               */
              if (response.ok) {
                /**
                 * Serialize the payload from backend.
                 */
                response.json().then((data) => {
                  /**
                   * Ensure there's data in the payload.
                   */
                  if (data) {
                    /**
                     * Dispatch that sign in was a success
                     */
                    console.log(
                      'Vendor Provider: Remove favorite success message',
                      data.message
                    );

                    /**
                     * Display a snackbar message
                     */
                    onSuccess(data.message);
                    /**
                     * Reload vendor data
                     */
                    loadVendorData(ID);
                  }
                });
              } else {
                /**
                 * Dispatch that sign in failed
                 */
                // response.json().then((data) => {
                //   if (data) {
                //     console.warn(
                //       'Vendor Provider: Remove favorite failed message',
                //       JSON.parse(data)
                //     );
                //     onWarning(JSON.parse(data));
                //   } else {
                //     onWarning('Request Failed');
                //   }
                // });
                console.warn(
                  'Vendor Provider: Remove favorite failed message',
                  response
                    .json()
                    .then((data) =>
                      data ? JSON.parse(data) : 'Request Failed'
                    )
                );
                /**
                 * Display warning message
                 */
                onWarning(
                  response
                    .json()
                    .then((data) =>
                      data ? JSON.parse(data) : 'Request Failed'
                    )
                );
              }
            }
          );
        } else {
          console.warn('Vendor Provider: Credetials error');
          /**
           * Display error message
           */
          onError('Request Failed');
        }
        console.groupEnd();
      },

      makeOffer: async (
        product: string,
        amount: string,
        accessToken: string
      ) => {
        const ID = vendorId || vendor?.id.toString() || '';
        console.group('Vendor Provider: Making Offer');
        /**
         * If credentials are validated...
         */
        if (
          product !== undefined &&
          amount !== undefined &&
          accessToken !== undefined
        ) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log('Fetching with', product, amount, accessToken);
          /**
           * Fetch make purchase to backend with credentials.
           */
          await makeOffer(product, ID, amount, accessToken).then(
            (response) => {
              /**
               * If status is ~200/successful...
               */
              if (response.ok) {
                /**
                 * Serialize the payload from backend.
                 */
                response.json().then((data) => {
                  /**
                   * Dispatch that purchas was initiated
                   */
                  console.log(
                    'Offer Success Order Status',
                    data.status
                  );
                  console.log('Offer Success Order data', data);
                  console.log('Offer Success Order Id', data.id);
                  /**
                   * Display a snackbar message
                   */
                  onSuccess(
                    `Offer Made. Status: ${data.status}. Order ID: ${data.id} `
                  );
                  /**
                   * Reload Vendor Data
                   */
                  loadVendorData(ID);
                });
              } else {
                /**
                 * Dispatch that purchase failed
                 */
                console.warn(
                  'Offer Failed',
                  response
                    .json()
                    .then((data) =>
                      data ? JSON.parse(data) : 'Offer Request Failed'
                    )
                );
                /**
                 * Display warning message
                 */
                onWarning(
                  response
                    .json()
                    .then((data) =>
                      data ? JSON.parse(data) : 'Offer Request Failed'
                    )
                );
              }
            }
          );
        } else {
          console.warn('Offer: Credentials error');

          /**
           * Display error message
           */
          onError('Request Failed with Credentials Error');
        }
        console.groupEnd();
      },

      makePurchase: async (product: string, accessToken: string) => {
        const ID = vendorId || vendor?.id.toString() || '';
        console.group('Vendor Provider: Making Purchase');
        /**
         * If credentials are validated...
         */
        if (product !== undefined && accessToken !== undefined) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log('fetching with', ID, product, accessToken);
          /**
           * Fetch make purchase to backend with credentials.
           */
          await makePurchase(product, ID, accessToken).then(
            (response) => {
              /**
               * If status is ~200/successful...
               */
              if (response.ok) {
                /**
                 * Serialize the payload from backend.
                 */
                response.json().then((data) => {
                  /**
                   * Dispatch that purchas was initiated
                   */
                  console.log(
                    'Purchase Success Order Status',
                    data.status
                  );
                  console.log('Purchase Success Order data', data);
                  console.log('Purchase Success Order Id', data.id);
                  /**
                   * Display a snackbar message
                   */
                  onSuccess(
                    `Purchase Initiated. Status: ${data.status}. Order ID: ${data.id} `
                  );
                  /**
                   * Reload Vendor Data
                   */
                  loadVendorData(ID);
                });
              } else {
                /**
                 * Dispatch that purchase failed
                 */
                console.warn(
                  'Purchase Failed',
                  response
                    .json()
                    .then((data) =>
                      data
                        ? JSON.parse(data)
                        : 'Purchase Request Failed'
                    )
                );
                /**
                 * Display warning message
                 */
                onWarning(
                  response
                    .json()
                    .then((data) =>
                      data
                        ? JSON.parse(data)
                        : 'Purchase Request Failed'
                    )
                );
              }
            }
          );
        } else {
          console.warn('Purchase: Credentials error');
          /**
           * Display error message
           */
          onError('Request Failed');
        }
        console.groupEnd();
      },

      acceptOffer: async (
        orderId: string,
        product: string,
        buyer: string,
        accessToken: string
      ) => {
        console.group('Vendor Provider: Accepting Offer');
        /**
         * If credentials are validated...
         */
        if (
          orderId !== undefined &&
          product !== undefined &&
          buyer !== undefined &&
          accessToken !== undefined
        ) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log(
            'Fetching with',
            orderId,
            product,
            buyer,
            accessToken
          );
          /**
           * Fetch make purchase to backend with credentials.
           */
          await acceptOffer(
            orderId,
            product,
            buyer,
            accessToken
          ).then((response) => {
            /**
             * If status is ~200/successful...
             */
            if (response.ok) {
              /**
               * Serialize the payload from backend.
               */
              response.json().then((data) => {
                /**
                 * Dispatch that purchas was initiated
                 */
                console.log(
                  'Accept Offer Success Order Status',
                  data.status
                );
                console.log('Accept Success Order data', data);
                console.log('Accept Success Order Id', data.id);
                /**
                 * Display a snackbar message
                 */
                onSuccess(
                  `Offer Accepted. Status: ${data.status}. Order ID: ${data.id} `
                );
                /**
                 * Reload Vendor Data
                 */
                vendorId && loadVendorData(vendorId);
              });
            } else {
              /**
               * Dispatch that purchase failed
               */
              console.warn(
                'Accept Failed',
                response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : 'Request to Accept Offer Failed'
                  )
              );
              /**
               * Display warning message
               */
              onWarning(
                response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : 'Request to Accept Offer Failed'
                  )
              );
            }
          });
        } else {
          console.warn('Offer: Credentials error');

          /**
           * Display error message
           */
          onError('Request Failed with Credentials Error');
        }
        console.groupEnd();
      },

      declineOffer: async (
        orderId: string,
        product: string,
        buyer: string,
        accessToken: string
      ) => {
        console.group('Vendor Provider: Declining Offer');
        /**
         * If credentials are validated...
         */
        if (
          orderId !== undefined &&
          product !== undefined &&
          buyer !== undefined &&
          accessToken !== undefined
        ) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log(
            'Fetching with',
            orderId,
            product,
            buyer,
            accessToken
          );
          /**
           * Fetch make declineoffer to backend with credentials.
           */
          await declineOffer(
            orderId,
            product,
            buyer,
            accessToken
          ).then((response) => {
            /**
             * If status is ~200/successful...
             */
            if (response.ok) {
              /**
               * Serialize the payload from backend.
               */
              response.json().then((data) => {
                /**
                 * Dispatch that purchas was initiated
                 */
                console.log(
                  'Decline Offer Success Order Status',
                  data.status
                );
                console.log('Decline Success Order data', data);
                console.log('Decline Success Order Id', data.id);
                /**
                 * Display a snackbar message
                 */
                onSuccess(
                  `Offer Declined. Status: ${data.status}. Order ID: ${data.id} `
                );
                /**
                 * Reload Vendor Data
                 */
                vendorId && loadVendorData(vendorId);
              });
            } else {
              /**
               * Dispatch that purchase failed
               */
              console.warn(
                'Decline Failed',
                response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : 'Request to Decline Offer Failed'
                  )
              );
              /**
               * Display warning message
               */
              onWarning(
                response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : 'Request to Decline Offer Failed'
                  )
              );
            }
          });
        } else {
          console.warn('Offer: Credentials error');
          /**
           * Display error message
           */
          onError('Request Failed with Credentials Error');
        }
        console.groupEnd();
      },

      completePayment: async (
        orderId: string,
        product: string,
        buyer: string,
        accessToken: string
      ) => {
        console.group('Vendor Provider: Completing Payment');
        /**
         * If credentials are validated...
         */
        if (
          orderId !== undefined &&
          product !== undefined &&
          buyer !== undefined &&
          accessToken !== undefined
        ) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log(
            'Fetching with',
            orderId,
            product,
            buyer,
            accessToken
          );
          /**
           * Fetch make purchase to backend with credentials.
           */
          await completePayment(
            orderId,
            product,
            buyer,
            accessToken
          ).then((response) => {
            /**
             * If status is ~200/successful...
             */
            if (response.ok) {
              /**
               * Serialize the payload from backend.
               */
              response.json().then((data) => {
                /**
                 * Dispatch that purchas was initiated
                 */
                console.log(
                  'Complete Payment Success Order Status',
                  data.status
                );
                console.log(
                  'Complete Payment Success Order data',
                  data
                );
                console.log(
                  'Complete Payment Success Order Id',
                  data.id
                );
                /**
                 * Display a snackbar message
                 */
                onSuccess(
                  `Payment Completed. Status: ${data.status}. Order ID: ${data.id} `
                );
                /**
                 * Reload Vendor Data
                 */
                vendorId && loadVendorData(vendorId);
              });
            } else {
              /**
               * Dispatch that purchase failed
               */
              console.warn(
                'Complete Payment Failed',
                response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : 'Request to Complete Payment Failed'
                  )
              );
              /**
               * Display warning message
               */
              onWarning(
                response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : 'Request to Complete Payment Failed'
                  )
              );
            }
          });
        } else {
          console.warn('Offer: Credentials error');

          /**
           * Display error message
           */
          onError('Request Failed with Credentials Error');
        }
        console.groupEnd();
      },

      createProduct: async (
        title: string,
        category: string,
        description: string,
        price: string,
        condition: string,
        accessToken: string,
        images?: FileList
      ) => {
        const ID = vendorId || vendor?.id.toString() || '';
        console.group('Vendor Provider: Creating Product');
        /**
         * If credentials are validated...
         */
        if (
          title !== undefined &&
          category !== undefined &&
          description !== undefined &&
          price !== undefined &&
          condition !== undefined &&
          accessToken !== undefined &&
          images !== undefined
        ) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log(
            'Fetching with',
            title,
            category,
            description,
            price,
            condition,
            accessToken,
            images
          );
          /**
           * Fetch add favorite to backend with credentials.
           */
          await createProduct(
            ID,
            title,
            category,
            description,
            price,
            condition,
            accessToken,
            images
          ).then((response) => {
            /**
             * If status is ~200/successful...
             */
            if (response.ok) {
              /**
               * Serialize the payload from backend.
               */
              response.json().then((data) => {
                /**
                 * Ensure there's data in the payload.
                 */
                if (data) {
                  /**
                   * Dispatch that create product was a success
                   */
                  console.log(
                    'Vendor Provider: Create Product success data',
                    data
                  );
                  /**
                   * Display a snackbar message
                   */
                  onSuccess(
                    `Product Created. Product ID: ${data.id}`
                  );
                  /**
                   * Reload vendor data
                   */
                  loadVendorData(ID);
                  console.log('current vendor id in fetch', vendorId);
                  /**
                   * Reload products
                   */
                  loadProducts();
                }
              });
            } else {
              /**
               * Dispatch that product creation failed
               */
              console.warn(
                'Vendor Provider: Create Productfailed message',
                response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : 'Creating Product Failed'
                  )
              );
              /**
               * Display warning message
               */
              onWarning(
                response
                  .json()
                  .then((data) =>
                    data
                      ? JSON.parse(data)
                      : 'Creating Product Failed'
                  )
              );
            }
          });
        } else {
          console.warn('Vendor Provider: Credetials error');
          console.log(
            vendorId,
            title,
            description,
            category,
            price,
            condition,
            accessToken,
            images
          );
          /**
           * Display error message
           */
          onError('Request Failed');
        }
        console.groupEnd();
      },

      updateProduct: async (
        slug: string,
        title: string,
        category: string,
        description: string,
        price: string,
        condition: string,
        accessToken: string,
        images?: FileList
      ) => {
        const ID = vendorId || vendor?.id.toString() || '';
        console.group('Vendor Provider: Updating Product');
        /**
         * If credentials are validated...
         */
        if (
          slug !== undefined &&
          title !== undefined &&
          category !== undefined &&
          description !== undefined &&
          price !== undefined &&
          condition !== undefined &&
          accessToken !== undefined &&
          images !== undefined
        ) {
          /**
           * Dispatch auth to launch loading.
           */
          console.log(
            'Fetching with',
            slug,
            title,
            category,
            description,
            price,
            condition,
            accessToken,
            images
          );
          /**
           * Fetch add favorite to backend with credentials.
           */
          await updateProduct(
            slug,
            ID,
            title,
            category,
            description,
            price,
            condition,
            accessToken,
            images
          ).then((response) => {
            /**
             * If status is ~200/successful...
             */
            if (response.ok) {
              /**
               * Serialize the payload from backend.
               */
              response.json().then((data) => {
                /**
                 * Ensure there's data in the payload.
                 */
                if (data) {
                  /**
                   * Dispatch that create product was a success
                   */
                  console.log(
                    'Vendor Provider: Update Product success data',
                    data
                  );
                  /**
                   * Display a snackbar message
                   */
                  onSuccess(
                    `Product Updated. Product ID: ${data.id}`
                  );
                  /**
                   * Reload vendor data
                   */
                  loadVendorData(ID);
                  // return {
                  //   status: data.status
                  // }
                  /**
                   * Reload products
                   */
                  loadProducts();
                }
              });
            } else {
              /**
               * Dispatch that product creation failed
               */
              console.warn(
                'Vendor Provider: Create Productfailed message',
                response
                  .json()
                  .then((data) =>
                    data ? JSON.parse(data) : 'Update Product Failed'
                  )
              );
              /**
               * Display warning message
               */
              onWarning(
                response
                  .json()
                  .then((data) =>
                    data ? JSON.parse(data) : 'Update Product Failed'
                  )
              );
            }
          });
        } else {
          console.warn('Vendor Provider: Credetials error');
          /**
           * Display error message
           */
          onError('Request Failed');
        }
        console.groupEnd();
      },

      loading,
      error,
      vendor,
      state,
      dispatch,
      vendorId,
      loadVendorData,
    }),
    [state]
  );

  return (
    <VendorData.Provider value={vendorContextValue}>
      {children}
      <View>
        <Toast
          open={openSuccess}
          setOpen={setOpenSuccess}
          success
          message={message}
        />
        <Toast
          open={openWarning}
          setOpen={setOpenWarning}
          warning
          message={message}
        />
        <Toast
          open={openError}
          setOpen={setOpenError}
          error
          message={message}
        />
      </View>
    </VendorData.Provider>
  );
}

export const useVendorData = () => React.useContext(VendorData);
