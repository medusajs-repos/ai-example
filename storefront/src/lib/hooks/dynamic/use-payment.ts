import { useQuery } from "@tanstack/react-query"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { queryKeys } from "@/lib/query-keys"

export const usePaymentMethods = ({
  region_id,
  fields,
}: {
  region_id?: string;
  fields?: string;
} = {}) => {
  return useQuery({
    queryKey: queryKeys.payments.sessions(region_id),
    queryFn: () => {
      return listCartPaymentMethods({ region_id: region_id!, fields })
    },
    enabled: !!region_id,
    staleTime: 0,
  })
}