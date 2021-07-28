import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme, ActivityIndicator } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";

import { OrderTransaction } from "../../components/orders/orderTransaction";
import { useVendorData } from "../../context/vendor.context";

import {
  OrderTransactionStackParamList,
  OrderTypeParamList,
} from "../../types";

// type OrderTransactionProps = OrderTypeParamList;

function Separator() {
  return <View style={{ height: StyleSheet.hairlineWidth }} />;
}

type Props = {
  navigation?: StackNavigationProp<OrderTransactionStackParamList>;
};

type OrderProps = React.ComponentProps<typeof OrderTransaction>;

function renderItem({ item }: { item: OrderProps }) {
  return <OrderTransaction {...item} />;
}

function keyExtractor(item: OrderProps) {
  return item.id.toString();
}

// type Props = {
//   navigation?: StackNavigationProp<OrderTypeParamList>;
// };

export const OrderTransactionScreen = (props: Props) => {
  const theme = useTheme();
  const { vendor, dispatch, loading, error } = useVendorData();

  return loading || !vendor ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
      style={{ backgroundColor: theme.colors.background }}
      //   data={vendor.order_requests.map((orderProps) => ({
      //   ...orderProps,
      // }))}
      // data={vendor.order_requests.map((order) => order)}
      data={
        vendor &&
        vendor.order_requests &&
        vendor.order_requests.map((orderReqs) => ({
          ...orderReqs,
          onPress: () =>
            props.navigation &&
            props.navigation.push("OrderDetails", {
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
