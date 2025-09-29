/**
 * Builds a URL path with a country code prefix, preserving search parameters.
 * Removes existing country code from the path before adding the new one.
 * 
 * @param currentPath - The current pathname (e.g., "/products" or "/us/products")
 * @param countryCode - The country code to prefix (e.g., "us", "gb")
 * @returns New path with country code prefix and preserved search parameters
 * 
 * @example
 * ```typescript
 * // Add country code to path
 * const newPath = buildPathWithCountryCode("/products", "us");
 * // Returns: "/us/products"
 * 
 * // Replace existing country code
 * const updatedPath = buildPathWithCountryCode("/gb/products", "us");
 * // Returns: "/us/products"
 * 
 * // Preserve search parameters
 * // If current URL is "/products?category=shirts"
 * const pathWithParams = buildPathWithCountryCode("/products", "us");
 * // Returns: "/us/products?category=shirts"
 * ```
 */
export function buildPathWithCountryCode(currentPath: string, countryCode: string): string {
  const pathWithoutCountry = currentPath.replace(`/${countryCode}`, "") || "/"
  const searchParams = Object.keys(location.search || {}).length > 0
    ? `?${new URLSearchParams(location.search as any).toString()}`
    : ""
  return `/${countryCode}${pathWithoutCountry === "/" ? "" : pathWithoutCountry}${searchParams}`
}