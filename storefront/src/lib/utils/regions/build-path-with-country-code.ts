export function buildPathWithCountryCode(currentPath: string, countryCode: string): string {
  const pathWithoutCountry = currentPath.replace(`/${countryCode}`, "") || "/"
  const searchParams = Object.keys(location.search || {}).length > 0
    ? `?${new URLSearchParams(location.search as any).toString()}`
    : ""
  return `/${countryCode}${pathWithoutCountry === "/" ? "" : pathWithoutCountry}${searchParams}`
}