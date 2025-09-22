import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { listCustomerOrders, retrieveOrder } from "@/lib/data/order";

export const useCustomerOrders = ({ fields }: { fields?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.customer.orders(),
    queryFn: () => listCustomerOrders({ fields }),
  });
};

export const useOrder = ({
  order_id,
  fields,
}: {
  order_id: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(order_id),
    queryFn: () => retrieveOrder({ order_id, fields }),
    enabled: !!order_id,
  });
};
