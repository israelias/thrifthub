import React from "react";
import { Image, IImageProps, Center, NativeBaseProvider } from "native-base";

export const ImageComponent = ({
  uri,
  alt_text,
  size = "xl",
  height,
  width,
  props,
}: {
  uri: string;
  alt_text: string;
  size?: string;
  height?: number;
  width?: number;
  props?: IImageProps;
}) => {
  const url = { uri: uri };
  return (
    <Image
      source={url}
      alt={alt_text}
      size={size}
      height={height}
      width={width}
      {...props}
    />
  );
};
