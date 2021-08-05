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

export const OrderRequestsScreen = (props: Props) => {
  const theme = useTheme();
  const { vendor, loading } = useVendorData();

  return loading || !vendor ? (
    <ActivityIndicator />
  ) : vendor && vendor.order_requests.length < 1 ? (
    <Text> You haven't sold anything yet!</Text>
  ) : (
    <FlatList
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
      }}
      style={{ backgroundColor: theme.colors.background }}
      data={
        vendor &&
        vendor.order_requests &&
        vendor.order_requests.map((orderReqs) => ({
          ...orderReqs,
          onPress: () =>
            props.navigation &&
            props.navigation.push('OrderDetails', {
              ...orderReqs,
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
