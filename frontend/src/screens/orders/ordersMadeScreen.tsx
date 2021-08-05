import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  useTheme,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

import { OrderTransaction } from '../../components/orders/orderTransaction';
import { useVendorData } from '../../context/vendor.context';

import { OrderTransactionStackParamList } from '../../types';

type Props = {
  navigation?: StackNavigationProp<OrderTransactionStackParamList>;
};

type OrderProps = React.ComponentProps<typeof OrderTransaction>;

export const OrdersMadeScreen = (props: Props) => {
  const theme = useTheme();
  const { vendor, loading } = useVendorData();

  return loading || !vendor ? (
    <ActivityIndicator />
  ) : vendor && vendor.orders_made.length < 1 ? (
    <Text> You haven't purchased anything yet! </Text>
  ) : (
    <FlatList
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
      }}
      style={{ backgroundColor: theme.colors.background }}
      data={
        vendor &&
        vendor.orders_made &&
        vendor.orders_made.map((ordersMade) => ({
          ...ordersMade,
          onPress: () =>
            props.navigation &&
            props.navigation.push('OrderDetails', {
              ...ordersMade,
            }),
        }))
      }
      renderItem={({ item }: { item: OrderProps }) => {
        return <OrderTransaction {...item} />;
      }}
      keyExtractor={(item: OrderProps) => item.id.toString()}
      ItemSeparatorComponent={() => (
        <View style={{ height: StyleSheet.hairlineWidth }} />
      )}
    />
  );
};
