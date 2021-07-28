import React from "react";
import {
  DEFAULT_AVATAR,
  DEFAULT_PLACEHOLDER,
} from "../constants/backend.constants";

export function useAvatarPlaceholder(image: ImagePreview) {
  const [avatarImage, setAvatarImage] = React.useState<string | undefined>(
    undefined
  );

  React.useMemo(() => {
    if (image) {
      if (image.thumbnail) {
        setAvatarImage(image.thumbnail);
      } else {
        if (image.full_size) {
          setAvatarImage(image.full_size);
        }
      }
    } else {
      setAvatarImage(DEFAULT_AVATAR);
    }
  }, [image]);

  return {
    avatarImage,
  };
}
