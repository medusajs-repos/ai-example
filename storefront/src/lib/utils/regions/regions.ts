export function getCountryCodeFromPath(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean)
  const potentialCountryCode = segments[0]?.toLowerCase()

  if (potentialCountryCode && potentialCountryCode.length === 2) {
    return potentialCountryCode
  }

  return undefined
}