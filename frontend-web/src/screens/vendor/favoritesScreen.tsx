import React, { ComponentType } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  VirtualizedList,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme, ActivityIndicator } from "react-native-paper";
import {
  ProductStackNavigatorParamList,
  ProductTypeParamList,
} from "../../types";
import { useVendorData } from "../../context/vendor.context";
import { Product } from "../../components/products/product";
import { getVendorFavorites } from "../../services/get.service";

type ProductProps = ProductStackNavigatorParamList["ProductDetails"];

function Separator() {
  return <View style={{ height: StyleSheet.hairlineWidth }} />;
}

type Props = {
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
};

export const FavoriteProductsScreen = (props: Props) => {
  const theme = useTheme();
  const {
    vendor,
    dispatch,
    vendorFavoritesFeed,
    vendorId,
    error,
    loading,
    loadVendorFaves,
  } = useVendorData();

  const [loadingFaves, setLoadingFaves] = React.useState(false);
  const [allVendorFaves, setAllVendorFaves] = React.useState<
    ProductTypeParamList[] | undefined
  >(undefined);
  // const loadVendorFaves = async () => {
  //   setLoadingFaves(true);
  //   const data = await getVendorFavorites(vendorId);
  //   if (data) {
  //     setAllVendorFaves(data);
  //     setLoadingFaves(false);
  //   }
  // };

  // React.useMemo(() => {
  //   if (vendor) {
  //     setAllVendorFaves(vendor.favorites);
  //   }
  // }, []);

  // React.useEffect(() => {
  //   setLoadingFaves(true)
  //   if (vendor) {
  //     setAllVendorFaves(vendor.favorites);
  //     setLoadingFaves(false)
  //   }
  // }, []);

  // React.useEffect(() => {
  //   if (vendorFavoritesFeed) {
  //     // @ts-ignore
  //     setAllVendorFaves(vendorFavoritesFeed);
  //   }
  // }, [vendorFavoritesFeed]);

  return loading ? (
    <ActivityIndicator />
  ) : vendor && vendor.favorites.length < 1 ? (
    <Text>You Haven't saved any product favorites</Text>
  ) : (
    <FlatList
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
      style={{ backgroundColor: theme.colors.background }}
      data={
        allVendorFaves &&
        allVendorFaves.map((productProps) => ({
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
