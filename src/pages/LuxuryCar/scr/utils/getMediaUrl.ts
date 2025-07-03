// src/utils/getMediaUrl.ts

interface MediaAttributes {
  url: string;
  mime?: string;
  name?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  // Add other attributes you might receive like formats, hash, etc. if you use them
}

export interface MediaDataItem {
  id: number;
  attributes: MediaAttributes;
}

export type MediaDataContent = MediaDataItem | MediaDataItem[] | string | null | undefined;

export const getMediaUrl = (
  mediaDataContent: MediaDataContent
): string => {
  let relativePath: string | undefined;

  if (typeof mediaDataContent === "string") {
    relativePath = mediaDataContent;
  } else if (mediaDataContent && !Array.isArray(mediaDataContent)) {
    relativePath = mediaDataContent.attributes?.url;
  } else if (Array.isArray(mediaDataContent) && mediaDataContent.length > 0) {
    relativePath = mediaDataContent[0].attributes?.url;
  } else {
    console.warn("getMediaUrl: No valid mediaDataContent provided or it's empty.");
    return "";
  }

  if (!relativePath) {
    console.warn("getMediaUrl: extracted relativePath was empty or undefined.");
    return "";
  }

  // Use your live API base URL here. Consider using environment variables.
  const STRAPI_BASE_URL = "https://api.lussogroupgeo.com";

  let fullUrl = "";
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    fullUrl = relativePath;
  } else {
    fullUrl = `${STRAPI_BASE_URL}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
  }

  return fullUrl;
};