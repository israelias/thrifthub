import React, { ComponentType } from "react";
import { FlatList, View, StyleSheet, VirtualizedList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme, ActivityIndicator } from "react-native-paper";

import { ProductStackNavigatorParamList } from "../../types";

import { useVendorData } from "../../context/vendor.context";
import { useProductsData } from "../../context/products.context";
import { Product } from "../../components/products/product";
import { getRequest } from "../../services/crud.service";
// type ProductProps = React.ComponentProps<typeof Product>;
type ProductProps = ProductStackNavigatorParamList["ProductDetails"];

function renderItem({ item }: { item: ProductProps }) {
  return <Product {...item} />;
}

function keyExtractor(item: ProductProps) {
  return item.id.toString();
}

function Separator() {
  return <View style={{ height: StyleSheet.hairlineWidth }} />;
}

type Props = {
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
};

export const ProductScreen = (props: Props) => {
  const theme = useTheme();

  const { products, dispatch, loading, error } = useProductsData();

  // const data = products?.map((productProps) => ({
  //   ...productProps,
  //   onPress: () =>
  //     props.navigation &&
  //     props.navigation.push("ProductDetails", {
  //       ...productProps,
  //     }),
  // }));

  // const [myLoading, setMyLoading] = React.useState(false);
  // const [myProd, setMyProd] = React.useState<ProductProps[] | undefined>(
  //   undefined
  // );
  // const loadProducts = async () => {
  //   setMyLoading(true);
  //   const data = await getRequest({
  //     url: `store/?expand=product_images,vendor,product,category&include=vendor.name`,
  //   });
  //   if (data) {
  //     setMyProd(data);
  //     setMyLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   loadProducts();
  // }, []);

  return loading ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
      style={{ backgroundColor: theme.colors.background }}
      data={
        products &&
        products.map((productProps) => ({
          ...productProps,
          onPress: () =>
            props.navigation &&
            props.navigation.push("ProductDetails", {
              ...productProps,
            }),
        }))
      }
      renderItem={({ item }: { item: ProductProps }) => {
        return <Product {...item} />;
      }}
      keyExtractor={(item: ProductProps) => item.id.toString()}
      ItemSeparatorComponent={Separator}
    />
  );
};
