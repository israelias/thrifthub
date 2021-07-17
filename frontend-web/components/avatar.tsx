import React from "react";
import { Avatar, HStack } from "native-base";
// import {
//   IAvatarProps,
//   IAvatarBadgeProps,
// } from "react-base/lib/typescript/components/composites/Avatar";

import { initialize } from "../utils/initialize";

export const UserAvatar = ({
  uri,
  size = "md",
  name,
  online,
}: {
  uri?: string;
  size?: string;
  name: string;
  online: boolean;
}) => {
  const url = { uri: uri };
  return (
    <Avatar source={url} size={size}>
      {initialize(name)}
      {online && <Avatar.Badge bg={"green.200"} />}
    </Avatar>
  );
};

export const UserAvatarGroup = ({
  size = "md",
  children,
}: {
  size: string;
  children: React.ReactElement[];
}) => {
  return (
    <Avatar.Group size={size} max={3}>
      {children}
    </Avatar.Group>
  );
};
