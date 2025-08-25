import { HttpTypes } from "@medusajs/types";

const BACKEND_URL =
  import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_API_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;
const DEFAULT_REGION = import.meta.env.VITE_DEFAULT_REGION || "dk";

interface RegionMapCache {
  regionMap: Map<string, HttpTypes.StoreRegion>;
  regionMapUpdated: number;
}

const regionMapCache: RegionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
};

export async function getRegionMap(): Promise<
  Map<string, HttpTypes.StoreRegion>
> {
  const { regionMap, regionMapUpdated } = regionMapCache;

  if (!BACKEND_URL) {
    throw new Error(
      "Error fetching regions. Did you set up regions in your Medusa Admin and define a VITE_MEDUSA_BACKEND_URL environment variable?"
    );
  }

  // Refresh cache every hour
  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          ...(PUBLISHABLE_API_KEY && {
            "x-publishable-api-key": PUBLISHABLE_API_KEY,
          }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch regions: ${response.statusText}`);
      }

      const { regions } = await response.json();

      if (!regions?.length) {
        throw new Error(
          "No regions found. Please set up regions in your Medusa Admin."
        );
      }

      // Clear existing map
      regionMapCache.regionMap.clear();

      // Create a map of country codes to regions
      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          if (c.iso_2) {
            regionMapCache.regionMap.set(c.iso_2, region);
          }
        });
      });

      regionMapCache.regionMapUpdated = Date.now();
    } catch (error) {
      console.error("Error fetching regions:", error);
      throw error;
    }
  }

  return regionMapCache.regionMap;
}

export function getCountryCodeFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const potentialCountryCode = segments[0]?.toLowerCase();

  if (potentialCountryCode && potentialCountryCode.length === 2) {
    return potentialCountryCode;
  }

  return null;
}

export async function getCountryCode(): Promise<string> {
  try {
    const regionMap = await getRegionMap();

    // Check if we have a stored country code in localStorage
    const storedCountryCode = localStorage.getItem("medusa_country_code");
    if (storedCountryCode && regionMap.has(storedCountryCode)) {
      return storedCountryCode;
    }

    // Try to detect from browser language/locale
    const browserLanguage = navigator.language.toLowerCase();
    const browserCountryCode = browserLanguage.split("-")[1];

    if (browserCountryCode && regionMap.has(browserCountryCode)) {
      localStorage.setItem("medusa_country_code", browserCountryCode);
      return browserCountryCode;
    }

    // Fallback to default region
    if (regionMap.has(DEFAULT_REGION)) {
      localStorage.setItem("medusa_country_code", DEFAULT_REGION);
      return DEFAULT_REGION;
    }

    // Last resort: use first available region
    const firstRegion = regionMap.keys().next().value;
    if (firstRegion) {
      localStorage.setItem("medusa_country_code", firstRegion);
      return firstRegion;
    }

    throw new Error("No regions available");
  } catch (error) {
    console.error("Error getting country code:", error);
    return DEFAULT_REGION;
  }
}

export function setCountryCode(countryCode: string) {
  localStorage.setItem("medusa_country_code", countryCode);
}

export async function getRegionByCountryCode(
  countryCode: string
): Promise<HttpTypes.StoreRegion | null> {
  try {
    const regionMap = await getRegionMap();
    return regionMap.get(countryCode) || null;
  } catch (error) {
    console.error("Error getting region by country code:", error);
    return null;
  }
}
