import { useQuery } from '@tanstack/react-query'
import { getRegion, listRegions } from '@/lib/data/regions';
import { queryKeys } from '@/lib/query-keys';

export const useRegions = ({ fields }: { fields?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.regions.list(),
    queryFn: () => listRegions({ fields }),
  })
}

export const useRegion = ({
  country_code,
  fields,
}: {
  country_code: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.regions.detail(country_code),
    queryFn: () => getRegion({ country_code, fields }),
  })
}