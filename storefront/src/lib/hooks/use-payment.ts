import { useQuery } from "@tanstack/react-query"
import { listCartPaymentMethods } from "@/lib/data/payment"

export const usePaymentMethods = (regionId?: string) => {
  return useQuery({
    queryKey: ["payment-methods", regionId],
    queryFn: () => {
      if (!regionId) {
        throw new Error('Region ID is required to fetch payment methods')
      }
      return listCartPaymentMethods(regionId)
    },
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}