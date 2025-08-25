import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const createCustomerAddress = async (
  address: HttpTypes.StoreCreateCustomerAddress
): Promise<HttpTypes.StoreCustomer> => {
  try {
    const { customer } = await sdk.store.customer.createAddress(address);
    return customer;
  } catch (error) {
    console.error("Failed to create address:", error);
    throw error;
  }
};

export const updateCustomerAddress = async ({
  addressId,
  address,
}: {
  addressId: string;
  address: HttpTypes.StoreUpdateCustomerAddress;
}): Promise<HttpTypes.StoreCustomer> => {
  try {
    const { customer } = await sdk.store.customer.updateAddress(
      addressId,
      address
    );
    return customer;
  } catch (error) {
    console.error("Failed to update address:", error);
    throw error;
  }
};

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  try {
    await sdk.store.customer.deleteAddress(addressId);
  } catch (error) {
    console.error("Failed to delete address:", error);
    throw error;
  }
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerAddress,
    onSuccess: (customer) => {
      queryClient.setQueryData(["customer"], customer);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerAddress,
    onSuccess: (customer) => {
      queryClient.setQueryData(["customer"], customer);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};
