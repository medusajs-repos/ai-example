import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { createCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from "@/lib/data/customer";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerAddress,
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.current(), customer);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerAddress,
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.current(), customer);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerAddress,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(queryKeys.customer.current(), data);
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.customer.all });
      }
    },
  });
};
