import _ from "lodash";

export const initialize = (name: string) => {
  return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();
};

export const firstInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

export function capitalize(str: string) {
  return str.toLowerCase().replace(/^.| ./g, _.toUpper);
}

export function capitalizeFirstLetter(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function normalizeUsername(username: string | undefined) {
  if (!username || typeof username !== "string") return undefined;
  return username.trim().toLowerCase();
}

// css utility
// https://github.com/devhubapp/devhub/blob/6e31725a63f42986eb040153aec7eb11723b8289/landing/tailwind.config.js#L5

export function toKebabCase(str: string) {
  if (!(str && typeof str === "string")) return "";

  const matches = str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+|\b)|[A-Z]?[a-z]+|[A-Z]|[0-9]+/g
  );
  if (!(matches && matches.length)) return str;

  return matches.map((s) => s.toLowerCase()).join("-");
}
