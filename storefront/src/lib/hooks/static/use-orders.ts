import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { listCustomerOrders, retrieveOrder } from "@/lib/data/order"

/**
 * React hook for fetching the current customer's orders.
 * Uses Tanstack Query for caching and automatic refetching.
 * 
 * @param fields - Optional fields to include in the order response
 * @returns Tanstack Query result object with orders array, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: orders, isLoading, error } = useCustomerOrders();
 * 
 * // With specific fields
 * const { data: orders } = useCustomerOrders({ 
 *   fields: '*items, *items.variant, *items.variant.product, shipping_address, billing_address'
 * });
 * 
 * // In a customer orders page
 * function CustomerOrdersPage() {
 *   const { data: orders, isLoading, error } = useCustomerOrders({
 *     fields: '*items, *items.variant, shipping_address, billing_address, payment_collection'
 *   });
 *   
 *   if (isLoading) return <div>Loading orders...</div>;
 *   if (error) return <div>Error loading orders</div>;
 *   
 *   return (
 *     <div>
 *       <h1>My Orders</h1>
 *       {orders?.orders.length === 0 ? (
 *         <p>No orders found</p>
 *       ) : (
 *         <div>
 *           {orders?.orders.map(order => (
 *             <OrderCard key={order.id} order={order} />
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useCustomerOrders = ({ fields }: { fields?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.customer.orders(),
    queryFn: () => listCustomerOrders({ fields }),
  })
}

/**
 * React hook for fetching a specific order by ID.
 * Uses Tanstack Query for caching and automatic refetching.
 * 
 * @param order_id - The ID of the order to fetch
 * @param fields - Optional fields to include in the order response
 * @returns Tanstack Query result object with order data, loading, and error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data: order, isLoading, error } = useOrder({
 *   order_id: 'order_123'
 * });
 * 
 * // With specific fields
 * const { data: order } = useOrder({
 *   order_id: 'order_123',
 *   fields: '*items, *items.variant, *items.variant.product, shipping_address, billing_address, payment_collection, shipping_methods'
 * });
 * 
 * // In an order details page
 * function OrderDetailsPage({ orderId }) {
 *   const { data: order, isLoading, error } = useOrder({
 *     order_id: orderId,
 *     fields: '*items, *items.variant, *items.variant.product, shipping_address, billing_address, payment_collection, shipping_methods, returns'
 *   });
 *   
 *   if (isLoading) return <div>Loading order...</div>;
 *   if (error) return <div>Error loading order</div>;
 *   if (!order) return <div>Order not found</div>;
 *   
 *   return (
 *     <div>
 *       <h1>Order #{order.display_id}</h1>
 *       <OrderSummary order={order} />
 *       <OrderItems items={order.items} />
 *       <OrderAddresses 
 *         shipping={order.shipping_address} 
 *         billing={order.billing_address} 
 *       />
 *       <OrderStatus status={order.status} />
 *     </div>
 *   );
 * }
 * ```
 */
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
  })
}
