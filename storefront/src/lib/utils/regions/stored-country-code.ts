export function getStoredCountryCode() {
  return localStorage.getItem("medusa_country_code") || undefined
}

export function setStoredCountryCode(countryCode: string) {
  localStorage.setItem("medusa_country_code", countryCode)
}