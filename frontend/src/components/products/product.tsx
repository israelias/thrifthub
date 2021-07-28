import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import {
  Surface,
  Title,
  Caption,
  Text,
  Avatar,
  TouchableRipple,
  Badge,
  useTheme,
  IconButton,
  Button,
  Chip,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TimeAgo } from "../common/time";
import { useVendorData } from "../../context/vendor.context";
import { useVendorIcon } from "../../hooks/useVendorIcon";
import { useImagePlaceholder } from "../../hooks/useImagePlaceholder";
import { useAvatarPlaceholder } from "../../hooks/useAvatarPlaceholder";

import { initialize } from "../../utils/initialize";
import {
  ProductStackNavigatorParamList,
  ProductTypeParamList,
} from "../../types";

type Props = {
  onPress?: (slug: string) => void;
} & ProductStackNavigatorParamList["ProductDetails"];

export const Product = (props: Props) => {
  const product = props;
  const onPress = props.onPress ? props.onPress : () => {};
  const theme = useTheme();

  const { vendorFaves } = useVendorData();

  const { vendorIcon, vendorInitials } = useVendorIcon();

  const { productImage, productThumbnail } = useImagePlaceholder(product.image);

  const { avatarImage } = useAvatarPlaceholder(product.vendor.image);

  const otherVendorInitials = initialize(product.vendor.name);

  const inFavorites = vendorFaves.some(
    (favorite: ProductTypeParamList) => favorite.id === product.id
  );

  console.log("productImage", productImage);
  console.log("productAvatar", avatarImage);
  console.log("otherVendorInitials", otherVendorInitials);
  console.log("vendorFaves", vendorFaves);
  console.log("inFaves", inFavorites);

  const iconColor = theme.colors.text;

  const contentColor = theme.colors.text;

  const imageBorderColor = theme.colors.text;

  const randomColor = () => {
    const hex = Math.floor(Math.random() * 0xffffff);
    return `${hex.toString(16)}`;
  };
  const ran = randomColor();
  const dom = randomColor();

  return (
    <TouchableRipple onPress={() => onPress(product.slug)}>
      <Surface style={styles.container}>
        <View style={styles.leftColumn}>
          <View>
            {avatarImage ? (
              <Avatar.Image
                size={60}
                style={{ marginRight: 10 }}
                source={{
                  uri: avatarImage,
                }}
              />
            ) : (
              <Avatar.Text
                size={60}
                style={{ marginRight: 10 }}
                label={otherVendorInitials}
              />
            )}

            <Badge
              size={10}
              style={{
                // ...styles.badge,
                position: "absolute",
                bottom: 0,
                right: 4,
                backgroundColor: product.vendor.online
                  ? theme.colors.accent
                  : theme.colors.disabled,
              }}
            />
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.topRow}>
            <Title>{product.title}</Title>

            {product.vendor.product_count > 0 && (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={14}
                  color={iconColor}
                />
                <Caption style={styles.iconDescription}>
                  {product.vendor.product_count}
                  {""} products
                </Caption>
              </View>
            )}

            {product.vendor.order_count > 0 && (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="currency-usd-off"
                  size={14}
                  color={iconColor}
                />
                <Caption style={styles.iconDescription}>
                  {product.vendor.order_count}
                  {""} transactions
                </Caption>
              </View>
            )}

            <Caption style={styles.handle}>{product.price}</Caption>

            <Caption>{product.condition}</Caption>
            {!product.is_available && (
              <Chip mode="flat" style={{ backgroundColor: theme.colors.error }}>
                SOLD
              </Chip>
            )}
          </View>

          <Text style={{ color: contentColor }}>{product.description}</Text>

          <Image
            source={{
              uri: productImage,
              // product.image.image.thumbnail
            }}
            style={[
              styles.image,
              {
                borderColor: imageBorderColor,
              },
            ]}
          />

          <View style={styles.bottomRow}>
            {product.is_available && (
              <>
                <TouchableOpacity
                  onPress={() => {}}
                  hitSlop={{ top: 10, bottom: 10 }}
                >
                  <View style={styles.iconContainer}>
                    <IconButton
                      icon="cash-multiple"
                      color={theme.colors.primary}
                      size={20}
                      onPress={() => console.log("Pressed")}
                    />
                    <Caption style={styles.iconDescription}>Offer</Caption>
                  </View>
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                  <IconButton
                    icon="cash-100"
                    color={theme.colors.primary}
                    size={20}
                    onPress={() => console.log("Pressed")}
                  />
                  <Text style={styles.iconDescription}>Purchase</Text>
                </View>
              </>
            )}

            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="share-outline"
                size={14}
                color={iconColor}
              />
              <Caption style={styles.iconDescription}>
                {product.is_available ? "posted" : "sold"}{" "}
                <TimeAgo
                  date={
                    product.is_available
                      ? product.created_at
                      : product.updated_at
                  }
                />
              </Caption>
            </View>

            <TouchableOpacity
              onPress={() => {}}
              hitSlop={{ top: 10, bottom: 10 }}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={inFavorites ? "heart" : "heart-outline"}
                  size={12}
                  color={inFavorites ? theme.colors.error : theme.colors.text}
                />
                <Caption style={styles.iconDescription}>
                  {inFavorites ? "Remove from Favorites" : "Add to Favorites"}
                </Caption>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Surface>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 15,
    paddingRight: 15,
  },
  leftColumn: {
    width: 100,
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  handle: {
    marginRight: 3,
  },
  dot: {
    fontSize: 3,
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    borderRadius: 20,
    width: "100%",
    height: 150,
  },
  bottomRow: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconDescription: {
    marginLeft: 2,
    lineHeight: 12,
  },
  button: {
    marginTop: 20,
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 4,
  },
});
