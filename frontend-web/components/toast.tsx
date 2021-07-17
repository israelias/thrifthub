import React from "react";
import {
  Button,
  useToast,
  CheckIcon,
  InfoIcon,
  WarningIcon,
  WarningTwoIcon,
  Center,
} from "native-base";
import {} from "native-base";

/**
 * The main prompt for all messages following fetch methods.
 *
 * @file defines feedback toast that relays message from backend.
 * @date 2021-07-18
 */
export const Prompt = ({
  message,
  error,
  warning,
  info,
}: {
  message: string;
  error?: boolean;
  warning?: boolean;
  info?: boolean;
}) => (
  <>
    <>
      {message}
      {error ? (
        <WarningTwoIcon />
      ) : warning ? (
        <WarningIcon />
      ) : info ? (
        <InfoIcon />
      ) : (
        <CheckIcon />
      )}
    </>
  </>
);
