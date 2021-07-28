import React from "react";
import {
  DEFAULT_AVATAR,
  DEFAULT_PLACEHOLDER,
} from "../constants/backend.constants";

export function useImagePlaceholder(image: ImagePreview) {
  const [productImage, setProductImage] = React.useState<string | undefined>(
    undefined
  );

  const [productThumbnail, setProductThumbnail] = React.useState<
    string | undefined
  >(undefined);

  React.useMemo(() => {
    if (image) {
      if (image.thumbnail) {
        setProductThumbnail(image.thumbnail);
      } else {
        if (image.full_size) {
          setProductThumbnail(image.full_size);
        }
      }
      if (image.full_size) {
        setProductImage(image.full_size);
      } else {
        setProductImage(DEFAULT_PLACEHOLDER);
      }
    } else {
      setProductThumbnail(DEFAULT_AVATAR);
      setProductImage(DEFAULT_PLACEHOLDER);
    }
  }, [image]);

  return {
    productImage,
    productThumbnail,
  };
}
