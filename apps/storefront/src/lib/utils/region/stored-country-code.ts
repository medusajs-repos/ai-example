export const COUNTRY_CODE_KEY = "medusa_country_code";

/**
 * Retrieves the stored country code from cookies.
 * Works on both server-side and client-side.
 * Useful for loading the customer's region based on their preferred country.
 *
 * @returns The stored country code string if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const countryCode = getStoredCountryCode();
 * if (countryCode) {
 *   // Use the stored country code for localization
 *   console.log(`User's preferred country: ${countryCode}`);
 * }
 * ```
 */
export function getStoredCountryCode(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split("; ");
  const countryCodeCookie = cookies.find((row) =>
    row.startsWith(`${COUNTRY_CODE_KEY}=`)
  );

  return countryCodeCookie?.split("=")[1] || undefined;
}

/**
 * Stores a country code in cookies for persistence across sessions.
 * Works on both server-side and client-side.
 * Useful after selecting a country in the country select component.
 *
 * @param countryCode - The country code string to store (e.g., "us", "gb")
 *
 * @example
 * ```typescript
 * setStoredCountryCode("us");
 * // Country code is now persisted in cookies
 *
 * // Later, retrieve it
 * const stored = getStoredCountryCode(); // "us"
 * ```
 */
export function setStoredCountryCode(countryCode: string): void {
  if (typeof document === "undefined") return;

  // Set cookie with 1 year expiration
  const maxAge = 60 * 60 * 24 * 365; // 1 year in seconds
  document.cookie = `${COUNTRY_CODE_KEY}=${countryCode}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
