import { createFileRoute } from "@tanstack/react-router";
import OrderConfirmation from "@/pages/order-confirmation";

export const Route = createFileRoute("/$countryCode/order/$orderId/confirmed")({
  component: OrderConfirmation,
});