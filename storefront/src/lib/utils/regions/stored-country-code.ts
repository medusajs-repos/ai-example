const COUNTRY_CODE_KEY = "medusa_country_code"

export function getStoredCountryCode() {
  return localStorage.getItem(COUNTRY_CODE_KEY) || undefined
}

export function setStoredCountryCode(countryCode: string) {
  localStorage.setItem(COUNTRY_CODE_KEY, countryCode)
}