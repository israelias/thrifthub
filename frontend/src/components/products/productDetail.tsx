import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Title,
  Caption,
  Avatar,
  Subheading,
  useTheme,
  Badge,
  Button,
  Text,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import color from 'color';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ProductStackNavigatorParamList } from '../../types';
import { TimeAgo } from '../common/time';
import { useVendorData } from '../../context/vendor.context';
import { useVendorIcon } from '../../hooks/useVendorIcon';
import { useImagePlaceholder } from '../../hooks/useImagePlaceholder';
import { useAvatarPlaceholder } from '../../hooks/useAvatarPlaceholder';
import { initialize } from '../../utils/initialize';
import * as ICONS from '../../constants/icons.constants';
import {
  DEFAULT_PLACEHOLDER,
  DEFAULT_AVATAR,
} from '../../constants/backend.constants';

export const randomColor = () => {
  const hex = Math.floor(Math.random() * 0xffffff);
  return `${hex.toString(16)}`;
};

export const ProductDetail = ({
  product,
  navigation,
  makeOffer,
  makePurchase,
  addToFaves,
}: {
  product: ProductStackNavigatorParamList['ProductDetails'];
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
  makeOffer?: (id: string) => void;
  makePurchase?: (id: string) => void;
  addToFaves?: (id: string) => void;
}) => {
  const theme = useTheme();

  const { vendorId, vendor } = useVendorData();

  const { vendorIcon, vendorInitials } = useVendorIcon();

  const { productImage, productThumbnail } = useImagePlaceholder(
    product.image
  );

  const { avatarImage } = useAvatarPlaceholder(product.vendor.image);

  const otherVendorInitials = initialize(product.vendor.name);

  const inFavorites = vendor?.favorites.some(
    (favorite) => favorite.id === product.id
  );

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const iconColor = color(theme.colors.text)
    .alpha(0.54)
    .rgb()
    .string();

  return (
    <Surface style={styles.container}>
      <View style={styles.topRow}>
        <Avatar.Image
          style={styles.avatar}
          source={{ uri: avatarImage }}
          size={60}
        />
        <View>
          <Title>{product.title}</Title>
          <Caption style={styles.handle}>
            {product.vendor.name}
          </Caption>
        </View>
      </View>
      <Subheading style={[styles.content, { color: contentColor }]}>
        {product.description}
      </Subheading>
      <Image
        source={{
          uri: productImage,
          // product.image.image.full_size
        }}
        style={[
          styles.image,
          {
            borderColor: imageBorderColor,
          },
        ]}
      />
      <Text style={{ marginBottom: 10 }}>{product.condition}</Text>
      <Text style={{ marginBottom: 10 }}>{product.price}</Text>
      <Text style={{ marginBottom: 10 }}>{product.price}</Text>
      <Text style={{ marginBottom: 10 }}>
        {product.is_available ? 'Posted' : 'Sold'}
        <TimeAgo
          date={
            product.is_available
              ? product.created_at
              : product.updated_at
          }
        />
      </Text>

      <View style={styles.bottomRow}>
        {product.is_available && (
          <>
            <TouchableOpacity
              onPress={() => {}}
              hitSlop={{ top: 10, bottom: 10 }}
            >
              <View style={styles.iconContainer}>
                <Button
                  mode="text"
                  uppercase
                  color={theme.colors.primary}
                  onPress={() =>
                    makePurchase
                      ? makePurchase(product.id.toString())
                      : {}
                  }
                >
                  Purchase
                </Button>
              </View>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Button
                mode="text"
                uppercase
                color={theme.colors.primary}
                onPress={() => {
                  // makeOffer ? makeOffer(product.id.toString()) : {}
                  console.log('product', product);
                  navigation &&
                    navigation.replace('MakeOffer', {
                      product: product,
                      ...product,
                    });
                }}
              >
                Offer
              </Button>
            </View>
          </>
        )}
      </View>

      {product.product_images && product.product_images.length > 0 && (
        <>
          <View style={{ height: StyleSheet.hairlineWidth }} />
          <View style={styles.bottomRow}>
            <View>
              <Title>Product Images</Title>
              <Caption style={styles.handle}>
                {product.vendor.name}
              </Caption>
            </View>

            {product.product_images.map((image) => (
              <TouchableOpacity
                onPress={() => {}}
                hitSlop={{ top: 10, bottom: 10 }}
              >
                <Avatar.Image
                  style={{ marginRight: 10 }}
                  source={{
                    uri: image.image.thumbnail
                      ? image.image.thumbnail
                      : image.image.full_size
                      ? image.image.full_size
                      : DEFAULT_PLACEHOLDER,
                  }}
                  size={40}
                />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      {product.similar_products &&
        product.similar_products.length > 0 && (
          <>
            <View style={{ height: StyleSheet.hairlineWidth }} />;
            <Title>Related Products</Title>
            <Caption style={styles.handle}>
              {product.category}
            </Caption>
            {product.similar_products.map((similar) => (
              <View style={styles.bottomRow}>
                <Title>{similar.title}</Title>
                {similar.id.toString() === vendorId ? (
                  <Caption style={styles.handle}>
                    Your Product
                  </Caption>
                ) : (
                  <Caption style={styles.handle}>
                    {similar.vendor}
                  </Caption>
                )}

                <TouchableOpacity
                  onPress={() => {}}
                  hitSlop={{ top: 10, bottom: 10 }}
                >
                  <Avatar.Image
                    style={{ marginRight: 10 }}
                    source={{
                      uri: similar.image.thumbnail
                        ? similar.image.thumbnail
                        : similar.image.full_size
                        ? similar.image.full_size
                        : DEFAULT_PLACEHOLDER,
                    }}
                    size={40}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {}}
        >
          <View>
            {product.id.toString() === vendorId ? (
              vendorIcon ? (
                <Avatar.Image
                  size={40}
                  style={{ marginRight: 10 }}
                  source={{
                    uri: vendorIcon,
                  }}
                />
              ) : vendorInitials ? (
                <Avatar.Text
                  size={40}
                  style={{ marginRight: 10 }}
                  label={vendorInitials}
                />
              ) : (
                <Avatar.Image
                  size={40}
                  style={{ marginRight: 10 }}
                  source={{ uri: DEFAULT_AVATAR }}
                />
              )
            ) : avatarImage ? (
              <Avatar.Image
                size={40}
                style={{ marginRight: 10 }}
                source={{
                  uri: vendorIcon,
                }}
              />
            ) : (
              <Avatar.Text
                size={40}
                style={{ marginRight: 10 }}
                label={otherVendorInitials}
              />
            )}

            <Badge
              style={{
                position: 'absolute',
                bottom: 0,
                right: 4,
                backgroundColor: product.vendor.online
                  ? theme.colors.accent
                  : theme.colors.disabled,
              }}
            />
          </View>
        </TouchableOpacity>
        <Title>{product.vendor.name}</Title>
        {product.vendor.product_count > 0 && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={ICONS.PRODUCT_COUNT_ICON}
              size={14}
              color={iconColor}
            />
            <Caption style={styles.iconDescription}>
              {product.vendor.product_count}
              {''} products
            </Caption>
          </View>
        )}
        {product.vendor.order_count > 0 && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={ICONS.ORDER_COUNT_ICON}
              size={14}
              color={iconColor}
            />
            <Caption style={styles.iconDescription}>
              {product.vendor.order_count}
              {''} transactions
            </Caption>
          </View>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatar: {
    marginRight: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handle: {
    marginRight: 3,
    lineHeight: 12,
  },
  content: {
    marginTop: 25,
    fontSize: 20,
    lineHeight: 30,
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 25,
    borderRadius: 20,
    width: '100%',
    height: 280,
  },
  thumbnail: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 25,
    borderRadius: 10,
    width: '25%',
    height: 140,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconDescription: {
    marginLeft: 2,
    lineHeight: 12,
  },
});
