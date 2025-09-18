import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async (): Promise<HttpTypes.StoreRegion[]> => {
  try {
    const response = await sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>('/store/regions', {
      method: 'GET',
    })
    return response.regions
  } catch (error) {
    console.error('Failed to fetch regions:', error)
    throw error
  }
}

export const retrieveRegion = async (id: string): Promise<HttpTypes.StoreRegion> => {
  try {
    const response = await sdk.client.fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: 'GET',
    })
    return response.region
  } catch (error) {
    console.error(`Failed to fetch region ${id}:`, error)
    throw error
  }
}

export const getRegion = async (countryCode: string): Promise<HttpTypes.StoreRegion | null> => {
  try {
    const regions = await listRegions()
    return regions.find(region => 
      region.countries?.some(country => country.iso_2 === countryCode.toLowerCase())
    ) || null
  } catch (error) {
    console.error(`Failed to get region for country ${countryCode}:`, error)
    return null
  }
}