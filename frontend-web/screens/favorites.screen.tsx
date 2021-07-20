import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";

import {
  Box,
  Divider,
  Wrap,
  useBreakpointValue,
  useMediaQuery,
  FlatList,
  View,
} from "native-base";

import { Text } from "../components/themed";
import { ProductCardPreview } from "../components/product/preview.product";

import { getRequest } from "../services/crud.service";

export enum ActionTypes {
  fetchProducts,
  fetchProductsSuccess,
  fetchProductsFailure,
}

export interface FetchProductsAction {
  type: ActionTypes;
  payload?: Product[];
  error?: object;
}

export interface StateInterface {
  payload?: Product[];
  loading: boolean;
  error?: object;
}

const initialState: StateInterface = {
  payload: [],
  loading: false,
  error: {},
};

export const productsReducer = (
  state = initialState,
  { type, payload, error }: FetchProductsAction
) => {
  switch (type) {
    case ActionTypes.fetchProducts:
      return { ...state, loading: true };

    case ActionTypes.fetchProductsSuccess:
      return { ...state, payload, loading: false };

    case ActionTypes.fetchProductsFailure:
      return { ...state, error: error, loading: false };

    default:
      return state;
  }
};

export default function TabTwoScreen() {
  const [state, dispatch] = React.useReducer(productsReducer, initialState);

  React.useEffect(() => {
    async function fetchPosts() {
      dispatch({ type: ActionTypes.fetchProducts });

      // const loadProducts = async () => {
      //   setLoading(true);
      //   const data = await getRequest({
      //     url: `store?expand=category,vendor,product_images`,
      //   });
      //   if (data) {
      //     setProducts(data);
      //     setLoading(false);
      //   }
      // };

      try {
        const response = await fetch(
          "https://thrifthub-backend.herokuapp.com/api/store?expand=product_images,vendor,product,category&include=vendor.name"
          // "http://localhost:8000/api/store?expand=category,vendor,product_images"
        );
        const products = await response.json();
        dispatch({
          type: ActionTypes.fetchProductsSuccess,
          payload: products,
        });
      } catch (e) {
        dispatch({ type: ActionTypes.fetchProductsFailure });
      }
    }

    fetchPosts();
  }, []);

  const { payload, loading, error } = state;

  console.log("REDUCEr", payload);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Failed to load posts!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      keyExtractor={(payload) => payload.id}
      data={payload}
      renderItem={({ item }) => (
        <View key={item.id} style={styles.post}>
          <Text style={styles.title}>
            {item.vendor.name}. {item.title}. {item.price}
          </Text>
          <Text style={styles.body}>{item.description}</Text>
        </View>
      )}
      // renderItem={({
      //   item: { id, title, description, price, is_available, vendor },
      //   index,
      // }) => (
      //   <View key={id} style={styles.post}>
      //     <Text style={styles.title}>
      //       {index}. {item.title}. {price}
      //     </Text>
      //     <Text style={styles.body}>{description}</Text>
      //   </View>
      // )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1ACDA5",
  },
  post: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    paddingVertical: 20,
    paddingRight: 20,
    marginLeft: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  body: {
    marginTop: 10,
    fontSize: 14,
    color: "#F8F8F8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
