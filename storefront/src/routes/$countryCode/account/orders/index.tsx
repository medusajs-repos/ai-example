import { createFileRoute } from "@tanstack/react-router";
import AccountOrders from "@/pages/account-orders";

export const Route = createFileRoute("/$countryCode/account/orders/")({
  component: AccountOrders,
});