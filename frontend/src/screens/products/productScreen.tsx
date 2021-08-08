import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

import { Product } from '../../components/products/product';
import { useProductsData } from '../../context/products.context';
import { useVendorData } from '../../context/vendor.context';

import { ProductStackNavigatorParamList } from '../../types';

type ProductProps = ProductStackNavigatorParamList['ProductDetails'];

function Separator() {
  return <View style={{ height: StyleSheet.hairlineWidth }} />;
}

export const ProductScreen = ({
  navigation,
}: {
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
}) => {
  const theme = useTheme();

  const { products, loading } = useProductsData();

  return loading ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
      }}
      style={{ backgroundColor: theme.colors.background }}
      data={
        products &&
        products.map((productProps) => ({
          ...productProps,
          onPress: () =>
            navigation &&
            navigation.navigate('ProductDetails', {
              ...productProps,
            }),
          makeOffer: () =>
            navigation &&
            navigation.navigate('MakeOffer', {
              product: productProps,
              ...productProps,
            }),
          updateProduct: () =>
            navigation &&
            navigation.navigate('UpdateProduct', {
              product: productProps,
              ...productProps,
            }),
        }))
      }
      renderItem={({ item }: { item: ProductProps }) => (
        <Product {...item} product={item} />
      )}
      keyExtractor={(item: ProductProps) => item.id.toString()}
      ItemSeparatorComponent={Separator}
    />
  );
};
