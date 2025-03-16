import { toaster } from "../ui/toaster";

export const capitalizeFirstLetter = (str) => {
    if (!str) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

export const urlToDomain = (url) => {
  return new URL(url).hostname;
};

export const processVisitTimestamp = (timestamp) => {
  if (typeof timestamp === "number") {
    if (timestamp > 11644473600000000) {
      // Chrome/Edge timestamp (Windows epoch)
      return (timestamp - 11644473600000000) / 1000;
    } else if (timestamp > 1000000000000) {
      // Firefox timestamp (Unix milliseconds)
      return timestamp / 1000;
    } else if (timestamp < 1000000000) {
      // Safari timestamp (Mac absolute time)
      return (timestamp + 978307200) * 1000;
    }
  }
  return timestamp;
};

export const showToast = (title, description, type) => {
  toaster.create({
    title,
    description,
    type,
  });
};