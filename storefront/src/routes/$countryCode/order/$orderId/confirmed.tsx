import { createFileRoute } from "@tanstack/react-router";
import OrderConfirmation from "../../../../pages/OrderConfirmation";

export const Route = createFileRoute("/$countryCode/order/$orderId/confirmed")({
  component: OrderConfirmation,
});