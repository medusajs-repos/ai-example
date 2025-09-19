import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async (): Promise<HttpTypes.StoreRegion[]> => {
  const { regions } = await sdk.store.region.list()
  return regions
}

export const retrieveRegion = async (id: string): Promise<HttpTypes.StoreRegion> => {
  const { region } = await sdk.store.region.retrieve(id)
  return region
}

export const getRegion = async (countryCode: string): Promise<HttpTypes.StoreRegion | null> => {
    const regions = await listRegions()
    return regions.find(region => 
      region.countries?.some(country => country.iso_2 === countryCode.toLowerCase())
    ) || null
}