import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { queryKeys } from "@/lib/query-keys"
import { initiatePaymentSession } from "@/lib/data/cart"

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

export const useInitiatePaymentSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiatePaymentSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate });
    },
  })
}