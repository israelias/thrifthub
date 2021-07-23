import React from "react";
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
        setVendorIcon(vendor.image.thumbnail);
      }
      setVendorInitials(initialize(vendor.name));
    }
  }, [vendor]);

  return {
    vendorIcon,
    vendorInitials,
  };
}
