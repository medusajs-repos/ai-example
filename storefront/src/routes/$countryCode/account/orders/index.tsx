import { createFileRoute } from "@tanstack/react-router";
import AccountOrders from "../../../../pages/AccountOrders";

export const Route = createFileRoute("/$countryCode/account/orders/")({
  component: AccountOrders,
});