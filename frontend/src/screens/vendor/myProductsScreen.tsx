import React, { ComponentType } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import {
  ProductStackNavigatorParamList,
  ProductTypeParamList,
} from '../../types';
import { useVendorData } from '../../context/vendor.context';
import { Product } from '../../components/products/product';

type ProductProps = ProductStackNavigatorParamList['ProductDetails'];

function Separator() {
  return <View style={{ height: StyleSheet.hairlineWidth }} />;
}

type Props = {
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
};

export const MyProductsScreen = (props: Props) => {
  const theme = useTheme();
  const { vendor, loading } = useVendorData();

  return loading ? (
    <ActivityIndicator />
  ) : vendor && vendor.products.length < 1 ? (
    <Text>You Haven't saved posted any products yet!</Text>
  ) : (
    <FlatList
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
      }}
      style={{ backgroundColor: theme.colors.background }}
      data={
        vendor &&
        vendor.products.map((productProps) => ({
          ...productProps,
          onPress: () =>
            props.navigation &&
            props.navigation.push('ProductDetails', {
              ...productProps,
            }),
        }))
      }
      renderItem={({ item }: { item: ProductProps }) => (
        <Product product={item} />
      )}
      keyExtractor={(item: ProductProps) => item.id.toString()}
      ItemSeparatorComponent={Separator}
    />
  );
};
