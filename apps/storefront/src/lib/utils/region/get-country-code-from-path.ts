/**
 * Extracts the country code from a URL pathname.
 * Assumes the country code is the first segment of the path and is 2 characters long.
 * 
 * @param pathname - The URL pathname to extract country code from
 * @returns The country code string if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * getCountryCodeFromPath("/us/products"); // "us"
 * getCountryCodeFromPath("/gb/account/profile"); // "gb"
 * getCountryCodeFromPath("/products"); // undefined
 * getCountryCodeFromPath("/"); // undefined
 * getCountryCodeFromPath("/usa/products"); // undefined (3 chars, not 2)
 * ```
 */
export function getCountryCodeFromPath(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean)
  const potentialCountryCode = segments[0]?.toLowerCase()

  if (potentialCountryCode && potentialCountryCode.length === 2) {
    return potentialCountryCode
  }

  return undefined
}