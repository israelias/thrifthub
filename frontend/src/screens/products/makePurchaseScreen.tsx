import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductStackNavigatorParamList } from '../../types';
import { MakePurchase } from '../../components/products/makePurchase';

export const MakePurchaseScreen = ({
  route,
  navigation,
}: {
  route: RouteProp<ProductStackNavigatorParamList, 'MakePurchase'>;
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
}) => {
  return (
    <MakePurchase
      {...route.params}
      product={route.params}
      navigation={navigation}
    />
  );
};
