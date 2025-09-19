import { createFileRoute, notFound } from "@tanstack/react-router";
import OrderConfirmation from "@/pages/order-confirmation";
import { retrieveOrder } from "@/lib/hooks/use-orders";

export const Route = createFileRoute("/$countryCode/order/$orderId/confirmed")({
  loader: async ({ params, context }) => {
    const { countryCode, orderId } = params;
    const { queryClient } = context;

    const order = await queryClient.ensureQueryData({
      queryKey: ["order", orderId],
      queryFn: () => retrieveOrder(orderId),
    });

    if (!order) {
      throw notFound();
    }

    return {
      countryCode,
      order,
    };
  },
  component: OrderConfirmation,
});