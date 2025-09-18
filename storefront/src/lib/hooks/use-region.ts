import { useQuery } from '@tanstack/react-query'
import { getStoredCountryCode } from "@/lib/utils/regions/stored-country-code";
import { getRegion, listRegions } from '@/lib/data/regions';

export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: listRegions,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export const useCurrentRegion = () => {
  return useQuery({
    queryKey: ['current-region'],
    queryFn: async () => {
      const countryCode = getStoredCountryCode()
      if (!countryCode) {
        return null
      }
      return await getRegion(countryCode)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useRegionByCountryCode = (countryCode: string) => {
  return useQuery({
    queryKey: ['region', countryCode],
    queryFn: () => getRegion(countryCode),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}