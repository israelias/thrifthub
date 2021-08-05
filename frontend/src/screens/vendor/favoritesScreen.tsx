import React, { ComponentType } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  VirtualizedList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import {
  ProductStackNavigatorParamList,
  ProductTypeParamList,
} from '../../types';
import { useVendorData } from '../../context/vendor.context';
import { Product } from '../../components/products/product';
import { getVendorFavorites } from '../../services/get.service';

type ProductProps = ProductStackNavigatorParamList['ProductDetails'];

function Separator() {
  return <View style={{ height: StyleSheet.hairlineWidth }} />;
}

type Props = {
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
};

export const FavoriteProductsScreen = (props: Props) => {
  const theme = useTheme();
  const { vendor, loading } = useVendorData();

  return loading ? (
    <ActivityIndicator />
  ) : vendor && vendor.favorites.length < 1 ? (
    <Text style={{ color: theme.colors.text }}>
      You Haven't saved any product favorites
    </Text>
  ) : (
    <FlatList
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
      }}
      style={{ backgroundColor: theme.colors.background }}
      data={
        vendor &&
        vendor.favorites.map((productProps) => ({
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
