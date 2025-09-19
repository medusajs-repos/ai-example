import { useQuery } from '@tanstack/react-query'
import { getStoredCountryCode } from "@/lib/utils/regions/stored-country-code";
import { getRegion, listRegions } from '@/lib/data/regions';

export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: listRegions,
  })
}
