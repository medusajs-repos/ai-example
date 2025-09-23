import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { createCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from "@/lib/data/customer"

export const useCreateCustomerAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomerAddress,
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.current(), customer)
    },
  })
}

export const useCustomerUpdateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCustomerAddress,
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.current(), customer)
    },
  })
}

export const useCustomerDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomerAddress,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(queryKeys.customer.current(), data)
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.customer.all })
      }
    },
  })
}
