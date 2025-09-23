import { HttpTypes } from "@medusajs/types"

export default function getDefaultCountryCode(regions: HttpTypes.StoreRegion[]): string | undefined {
  let defaultCountryCode = undefined
  regions.some((r) => {
    defaultCountryCode = r.countries?.[0]?.iso_2
    return defaultCountryCode !== undefined
  })
  return defaultCountryCode
}