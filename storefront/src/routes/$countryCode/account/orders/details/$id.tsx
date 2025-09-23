import { createFileRoute, notFound } from "@tanstack/react-router"
import OrderDetailsPage from "@/pages/order-details"
import { retrieveOrder } from "@/lib/data/order"
import { queryKeys } from "@/lib/query-keys"

export const Route = createFileRoute("/$countryCode/account/orders/details/$id")({
  loader: async ({ params, context }) => {
    const { countryCode, id } = params
    const { queryClient } = context

    const order = await queryClient.ensureQueryData({
      queryKey: queryKeys.orders.detail(id),
      queryFn: () => retrieveOrder({ 
        order_id: id,
        fields: "id, display_id, created_at, currency_code, status, email, *items, *shipping_address, *billing_address, *shipping_methods, *payment_collections.payment_sessions, subtotal, shipping_total, discount_total, tax_total, total"
      }),
    })

    if (!order) {
      throw notFound()
    }

    return {
      countryCode,
      order,
    }
  },
  component: OrderDetailsPage,
})