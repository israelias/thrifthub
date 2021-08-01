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
  Text,
  Avatar,
  TouchableRipple,
  Badge,
  useTheme,
  IconButton,
  Button,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import color from 'color';

import { TimeAgo } from '../common/time';
import { useVendorData } from '../../context/vendor.context';
import { useVendorIcon } from '../../hooks/useVendorIcon';
import { useImagePlaceholder } from '../../hooks/useImagePlaceholder';
import { useAvatarPlaceholder } from '../../hooks/useAvatarPlaceholder';

import { initialize } from '../../utils/initialize';

import * as ICONS from '../../constants/icons.constants';
import {
  ProductStackNavigatorParamList,
  ProductTypeParamList,
  OrderTypeParamList,
} from '../../types';

type Props = {
  onPress?: (slug: string) => void;
  makeOffer?: (id: string) => void;
  makePurchase?: (id: string) => void;
  addToFaves?: (id: string) => void;
} & ProductStackNavigatorParamList['ProductDetails'];

export type AvailableType = 'OFFERED' | 'DENIED' | 'PENDING';
export type SoldType = 'PROCESSING' | 'ACCEPTED' | 'COMPLETED';

export const Product = ({
  product,
  onPress,
  makeOffer,
  acceptOffer,
  declineOffer,
  makePurchase,
  addToFaves,
  removeFromFaves,
}: {
  product: ProductStackNavigatorParamList['ProductDetails'];
  onPress?: (slug: string) => void;
  makeOffer?: (id: string) => void;
  acceptOffer?: (id: string) => void;
  declineOffer?: (id: string) => void;
  makePurchase?: (id: string) => void;
  addToFaves?: (id: string) => void;
  removeFromFaves?: (id: string) => void;
}) => {
  const theme = useTheme();
  const iconColor = color(theme.colors.text)
    .alpha(0.54)
    .rgb()
    .string();

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const { vendorFaves, vendor } = useVendorData();

  const { vendorIcon, vendorInitials } = useVendorIcon();

  const { productImage, productThumbnail } = useImagePlaceholder(
    product.image
  );

  const { avatarImage } = useAvatarPlaceholder(product.vendor.image);

  const otherVendorInitials = initialize(product.vendor.name);

  const inFavorites = vendor?.favorites.some(
    (favorite: ProductTypeParamList) => favorite.id === product.id
  );

  const isMyProduct = vendor?.products.some(
    (myProd: ProductTypeParamList) => myProd.id === product.id
  );

  const hasPendingOffer = vendor?.order_requests.some(
    (orderReq: OrderTypeParamList) =>
      orderReq.vendor.id === vendor.id &&
      orderReq.status === 'OFFERED'
  );

  const isPurchased = vendor?.order_requests.some(
    (orderReq: OrderTypeParamList) =>
      orderReq.vendor.id === vendor.id &&
      orderReq.status === ('PROCESSING' || 'COMPLETED')
  );

  const inMyOffers = vendor?.orders_made.some(
    (ordersMade: OrderTypeParamList) =>
      ordersMade.buyer.id === vendor.id &&
      ordersMade.status === 'OFFERED'
  );

  const isMyPurchase = vendor?.orders_made.some(
    (ordersMade: OrderTypeParamList) =>
      ordersMade.buyer.id === vendor.id &&
      ordersMade.status === ('PROCESSING' || 'COMPLETED')
  );

  console.log('Product: ', product.title);
  console.log('Product: productImage', productImage);
  console.log('Product: productAvatar', avatarImage);
  console.log('Product: otherVendorInitials', otherVendorInitials);

  console.log('Product: inFaves', inFavorites);
  console.log('Product: isMyProduct', isMyProduct);
  console.log('Product: hasPendingOffer', hasPendingOffer);

  console.log('Product: Mine and isPurchased', isPurchased);
  console.log('Product: Not Mine and inMyOffers', inMyOffers);
  console.log('Product: Not Mine and isMyPurchase', isMyPurchase);

  return (
    <TouchableRipple
      onPress={() => (onPress ? onPress(product.slug) : {})}
    >
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
                position: 'absolute',
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

            <Caption style={styles.handle}>{product.price}</Caption>

            <Caption>{product.condition}</Caption>
            {!product.is_available && (
              <Chip
                mode="flat"
                style={{ backgroundColor: theme.colors.error }}
              >
                SOLD
              </Chip>
            )}
          </View>

          {/* <Text style={{ color: contentColor }}>{product.description}</Text> */}

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
                      icon={ICONS.MAKE_OFFER_ICON}
                      color={theme.colors.primary}
                      size={20}
                      disabled={isMyProduct}
                      onPress={() =>
                        hasPendingOffer
                          ? acceptOffer &&
                            acceptOffer(product.id.toString())
                          : !inMyOffers
                          ? makeOffer &&
                            makeOffer(product.id.toString())
                          : console.log(
                              'this is already in your purchased'
                            )
                      }
                    />
                    <Caption style={styles.iconDescription}>
                      {hasPendingOffer
                        ? 'Accept Offer'
                        : inMyOffers
                        ? 'In Your Cart'
                        : 'Offer'}
                    </Caption>
                  </View>
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                  <IconButton
                    icon={ICONS.MAKE_PURCHASE_ICON}
                    color={theme.colors.primary}
                    disabled={isMyProduct || isPurchased}
                    size={20}
                    onPress={() =>
                      !isMyPurchase && !isMyProduct
                        ? makePurchase &&
                          makePurchase(product.id.toString())
                        : hasPendingOffer && !inMyOffers
                        ? declineOffer &&
                          declineOffer(product.id.toString())
                        : {}
                    }
                  />
                  <Text style={styles.iconDescription}>
                    {isPurchased && !isMyPurchase
                      ? 'Your Sale'
                      : hasPendingOffer && !inMyOffers
                      ? 'Decline Offer'
                      : 'Purchase'}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={ICONS.PRODUCT_TIMESTAMP_ICON}
                size={14}
                color={iconColor}
              />
              <Caption style={styles.iconDescription}>
                {product.is_available ? 'posted' : 'sold'}{' '}
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
              onPress={() =>
                inFavorites
                  ? removeFromFaves &&
                    removeFromFaves(product.id.toString())
                  : addToFaves && addToFaves(product.id.toString())
              }
              hitSlop={{ top: 10, bottom: 10 }}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={
                    inFavorites
                      ? ICONS.PRODUCT_IN_FAVORITES_ICON
                      : ICONS.PRODUCT_NOT_IN_FAVORITES_ICON
                  }
                  size={12}
                  color={
                    inFavorites
                      ? theme.colors.error
                      : theme.colors.text
                  }
                />
                <Caption style={styles.iconDescription}>
                  {inFavorites
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
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
    flexDirection: 'row',
    paddingTop: 15,
    paddingRight: 15,
  },
  leftColumn: {
    width: 100,
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
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
    width: '100%',
    height: 150,
  },
  bottomRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconDescription: {
    marginLeft: 2,
    lineHeight: 12,
  },
  button: {
    marginTop: 20,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
  },
});
