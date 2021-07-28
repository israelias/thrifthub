import React from "react";
import { RouteProp } from "@react-navigation/native";
import { ProductStackNavigatorParamList } from "../../types";
import { ProductDetail } from "../../components/products/productDetail";

type Props = {
  route: RouteProp<ProductStackNavigatorParamList, "ProductDetails">;
};

export const ProductDetailScreen = (props: Props) => {
  return <ProductDetail {...props.route.params} />;
};
