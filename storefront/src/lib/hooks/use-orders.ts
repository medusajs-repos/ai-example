import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { useQuery } from "@tanstack/react-query";

export const listCustomerOrders = async (): Promise<HttpTypes.StoreOrder[]> => {
  try {
    const { orders } = await sdk.store.order.list({});
    return orders;
  } catch (error) {
    console.error("Failed to fetch customer orders:", error);
    return [];
  }
};

export const retrieveOrder = async (
  orderId: string
): Promise<HttpTypes.StoreOrder | null> => {
  try {
    const { order } = await sdk.store.order.retrieve(orderId);
    return order;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
};

export const useCustomerOrders = () => {
  return useQuery({
    queryKey: ["customer-orders"],
    queryFn: listCustomerOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => retrieveOrder(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
