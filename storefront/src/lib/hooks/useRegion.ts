import { useQuery } from '@tanstack/react-query'
import { HttpTypes } from '@medusajs/types'
import { getCountryCode, getRegionByCountryCode, getRegionMap } from '@lib/util/regions'

export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const regionMap = await getRegionMap()
      return Array.from(regionMap.values())
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export const useCurrentRegion = () => {
  return useQuery({
    queryKey: ['current-region'],
    queryFn: async () => {
      const countryCode = await getCountryCode()
      return await getRegionByCountryCode(countryCode)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useRegionByCountryCode = (countryCode: string) => {
  return useQuery({
    queryKey: ['region', countryCode],
    queryFn: () => getRegionByCountryCode(countryCode),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}