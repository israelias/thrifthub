import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductStackNavigatorParamList } from '../../types';
import { MakeOffer } from '../../components/products/makeOffer';

export const MakeOfferScreen = ({
  route,
  navigation,
}: {
  route: RouteProp<ProductStackNavigatorParamList, 'MakeOffer'>;
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
}) => {
  return (
    <MakeOffer
      {...route.params}
      product={route.params}
      navigation={navigation}
    />
  );
};
