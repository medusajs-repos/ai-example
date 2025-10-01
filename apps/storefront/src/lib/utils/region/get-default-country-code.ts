import { HttpTypes } from "@medusajs/types"

/**
 * Gets the default country code from the first available region.
 * Returns the ISO 2-letter country code of the first country in the first region.
 * 
 * @param regions - Array of store regions containing country information
 * @returns The default country code string or undefined if no regions/countries found
 * 
 * @example
 * ```typescript
 * const regions = [
 *   { countries: [{ iso_2: "us" }, { iso_2: "ca" }] },
 *   { countries: [{ iso_2: "gb" }] }
 * ];
 * const defaultCode = getDefaultCountryCode(regions);
 * // Returns: "us" (first country of first region)
 * 
 * // Handle case with no regions
 * const noRegions = getDefaultCountryCode([]);
 * // Returns: undefined
 * ```
 */
export default function getDefaultCountryCode(regions: HttpTypes.StoreRegion[]): string | undefined {
  let defaultCountryCode = undefined
  regions.some((r) => {
    defaultCountryCode = r.countries?.[0]?.iso_2
    return defaultCountryCode !== undefined
  })
  return defaultCountryCode
}