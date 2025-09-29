const COUNTRY_CODE_KEY = "medusa_country_code"

/**
 * Retrieves the stored country code from localStorage.
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
  return localStorage.getItem(COUNTRY_CODE_KEY) || undefined
}

/**
 * Stores a country code in localStorage for persistence across sessions.
 * Useful after selecting a country in the country select component.
 * 
 * @param countryCode - The country code string to store (e.g., "us", "gb")
 * 
 * @example
 * ```typescript
 * setStoredCountryCode("us");
 * // Country code is now persisted in localStorage
 * 
 * // Later, retrieve it
 * const stored = getStoredCountryCode(); // "us"
 * ```
 */
export function setStoredCountryCode(countryCode: string): void {
  localStorage.setItem(COUNTRY_CODE_KEY, countryCode)
}