import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductStackNavigatorParamList } from '../../types';
import { ProductDetail } from '../../components/products/productDetail';

type ProductProps = ProductStackNavigatorParamList['ProductDetails'];

export const ProductDetailScreen = ({
  route,
  navigation,
}: {
  route: RouteProp<ProductStackNavigatorParamList, 'ProductDetails'>;
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
}) => {
  const makeOffer = (product: ProductProps) =>
    navigation &&
    navigation.navigate('MakeOffer', {
      product,
      productId: product.id.toString(),
      vendorId: product.vendor.id.toString(),
      ...product,
    });
  console.log('is this whats making it work');
  return (
    <ProductDetail
      {...route.params}
      product={route.params}
      navigation={navigation}
      makeOffer={() => makeOffer}
    />
  );
};
