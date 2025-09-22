import { useQuery } from '@tanstack/react-query'
import { getRegion, listRegions } from '@/lib/data/regions';

export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: listRegions,
  })
}

export const useRegion = (countryCode: string) => {
  return useQuery({
    queryKey: ['region', countryCode],
    queryFn: () => getRegion(countryCode),
  })
}