import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Surface,
  Text,
  Avatar,
  Button,
  Title,
  Subheading,
  Paragraph,
  Caption,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { capitalize } from "../../utils/initialize";
import { TimeAgo } from "../common/time";

import { useVendorData } from "../../context/vendor.context";

import {
  OrderTransactionStackParamList,
  OrderTypeParamList,
} from "../../types";

type Props = {
  onPress?: (id: number) => void;
} & OrderTypeParamList;

export const OrderTransaction = (props: Props) => {
  const order = props;
  const theme = useTheme();

  const { vendor, vendorId } = useVendorData();

  // const contentColor = color(theme.colors.text).alpha(0.8).rgb().string();
  const contentColor = theme.colors.text;

  return (
    <Surface style={styles.container}>
      <View style={styles.leftColumn}>
        <MaterialCommunityIcons
          name="currency-usd-off"
          size={30}
          color="#8d38e8"
        />
      </View>
      <View style={styles.rightColumn}>
        <View style={styles.topRow}>
          {order.product.image && (
            <Avatar.Image
              source={{ uri: order.product.image.thumbnail }}
              size={60}
            />
          )}
        </View>
        <Title>Status</Title>
        <Subheading style={{ marginBottom: 10 }}>{order.status}</Subheading>
        <Title>Product</Title>
        <Paragraph>
          {order.product.title ? order.product.title : order.product.toString()}
        </Paragraph>
        <Title>Seller</Title>
        <Paragraph>
          {order.vendor.name
            ? capitalize(order.vendor.name)
            : vendor && order.vendor.toString() === vendorId
            ? vendor.name
            : order.vendor.toString()}
        </Paragraph>
        <Button
          mode="text"
          uppercase
          color={theme.colors.primary}
          onPress={() => console.log("Pressed")}
        >
          View
        </Button>

        <Caption style={{ color: contentColor }}>
          {order.updated_at ||
            (order.created_at && (
              <TimeAgo date={order.updated_at || order.created_at} />
            ))}
        </Caption>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  leftColumn: {
    width: 100,
    marginRight: 10,
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
