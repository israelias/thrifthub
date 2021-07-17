import React from "react";
import { Box, HStack, VStack, Text, Pressable } from "native-base";
import { TimeAgo } from "../time";
import { ImageComponent } from "../image";

export function ProductCardPreview({ product }: { product: Product }) {
  return (
    <>
      <Box
        bg="primary.600"
        py={4}
        px={3}
        shadow={4}
        rounded="md"
        alignSelf="center"
        width="100%"
        maxWidth="100%"
      >
        <HStack justifyContent="space-between">
          <Box justifyContent="space-between">
            <VStack space={2}>
              <Text fontSize="sm" color="white">
                {product.created_at && (
                  <>
                    {" "}
                    "posted" <TimeAgo date={product.created_at} />{" "}
                  </>
                )}
              </Text>
              <Text color="white" fontSize="lg">
                {product.title}
              </Text>
              <Text lineHeight={[5, 5, 7]} noOfLines={4} color="gray.700">
                {product.description}
              </Text>
              <Text color="gray.400">{product.category.name}</Text>
              <Text color="gray.400">{product.vendor.name}</Text>
            </VStack>
            <HStack>
              <Pressable
                rounded="sm"
                bg="primary.400"
                alignSelf="flex-start"
                py={2}
                px={3}
              >
                <Text
                  textTransform="uppercase"
                  fontSize={"sm"}
                  fontWeight="bold"
                  color="white"
                >
                  Fave
                </Text>
              </Pressable>
              {product.is_available ? (
                <Pressable
                  rounded="sm"
                  bg="primary.400"
                  alignSelf="flex-start"
                  py={2}
                  px={3}
                >
                  <Text
                    textTransform="uppercase"
                    fontSize={"sm"}
                    fontWeight="bold"
                    color="white"
                  >
                    OFFER
                  </Text>
                </Pressable>
              ) : (
                <Text
                  textTransform="uppercase"
                  fontSize={"sm"}
                  fontWeight="bold"
                  color="red"
                >
                  Sold
                </Text>
              )}
              <Pressable
                rounded="sm"
                bg="primary.400"
                alignSelf="flex-start"
                py={2}
                px={3}
              >
                <Text
                  textTransform="uppercase"
                  fontSize={"sm"}
                  fontWeight="bold"
                  color="white"
                >
                  View
                </Text>
              </Pressable>
            </HStack>
          </Box>

          {product.product_images.length > 0 &&
            product.product_images.map((product_image) => (
              <ImageComponent
                uri={product_image.image?.thumbnail}
                alt_text={product_image?.alt_text}
                height={100}
                // rounded="full"
                width={100}
              />
            ))}
        </HStack>
      </Box>
    </>
  );
}
