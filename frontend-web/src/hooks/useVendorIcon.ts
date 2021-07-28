import React from "react";
import {
  DEFAULT_AVATAR,
  DEFAULT_PLACEHOLDER,
} from "../constants/backend.constants";
import { initialize } from "../utils/initialize";
import { useVendorData } from "../context/vendor.context";

export function useVendorIcon() {
  const { vendor } = useVendorData();

  const [vendorIcon, setVendorIcon] = React.useState<string | undefined>(
    undefined
  );
  const [vendorInitials, setVendorInitials] = React.useState<
    string | undefined
  >(undefined);

  React.useMemo(() => {
    if (vendor) {
      if (vendor.image) {
        if (vendor.image.thumbnail) {
          setVendorIcon(vendor.image.thumbnail);
        } else {
          setVendorIcon(vendor.image.full_size);
        }
      } else {
        setVendorIcon(DEFAULT_AVATAR);
      }
      setVendorInitials(initialize(vendor.name));
    }
  }, [vendor]);

  return {
    vendorIcon,
    vendorInitials,
  };
}
