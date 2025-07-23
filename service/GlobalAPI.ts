import axios from "axios";

const API_CALL_INTERVAL = 500; // milliseconds
let lastApiCallTime = 0;

interface PlaceDetailsResult {
  photos?: { photo_reference: string }[];
}

interface PlaceDetailsData {
  results?: PlaceDetailsResult[];
}

interface PlaceDetailsResponse {
  data: PlaceDetailsData;
}

const placeDetailsCache = new Map<string, PlaceDetailsResponse>();

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface ApiParams {
  [key: string]: string | number | boolean;
}

const makeApiCall = async (url: string, params: ApiParams) => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;

  if (timeSinceLastCall < API_CALL_INTERVAL) {
    await delay(API_CALL_INTERVAL - timeSinceLastCall);
  }

  try {
    lastApiCallTime = Date.now();
    const response = await axios.get(url, { params });
    return response;
  } catch (error: unknown) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      // Handle specific error codes, e.g., rate limiting
      if (error.response?.status === 429) {
        console.warn("Rate limit exceeded. Please try again later.");
        throw new Error("Rate limit exceeded. Please try again later.");
      }
    }
    throw error; // Re-throw the error for the component to handle
  }
};

export const GetPlaceDetails = async (query: string) => {
  if (placeDetailsCache.has(query)) {
    return placeDetailsCache.get(query);
  }

  const response = await makeApiCall("/api/place-details", { query });
  placeDetailsCache.set(query, response);
  return response;
};

export const GetHotelDetails = async (hotelName: string, location: string) => {
  const query = `${hotelName} hotel in ${location}`;
  if (placeDetailsCache.has(query)) {
    return placeDetailsCache.get(query);
  }

  const response = await makeApiCall("/api/place-details", {
    query,
    type: "lodging",
  });
  placeDetailsCache.set(query, response);
  return response;
};

export const GetPlacePhoto = (photoReference: string, maxwidth = 800) => {
  if (!photoReference) return null;
  return `/api/place-photos?maxwidth=${maxwidth}&photo_reference=${photoReference}`;
};
