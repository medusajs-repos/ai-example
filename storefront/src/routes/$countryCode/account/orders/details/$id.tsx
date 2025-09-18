import { createFileRoute } from "@tanstack/react-router";
import OrderDetails from "@/pages/order-details";

export const Route = createFileRoute("/$countryCode/account/orders/details/$id")({
  component: OrderDetails,
});