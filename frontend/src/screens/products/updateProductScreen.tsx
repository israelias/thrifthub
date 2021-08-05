import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductStackNavigatorParamList } from '../../types';
import { UpdateProduct } from '../../components/products/updateProduct';

export const UpdateProductScreen = ({
  route,
  navigation,
}: {
  route: RouteProp<ProductStackNavigatorParamList, 'UpdateProduct'>;
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
}) => {
  return (
    <UpdateProduct
      {...route.params}
      product={route.params}
      navigation={navigation}
    />
  );
};
