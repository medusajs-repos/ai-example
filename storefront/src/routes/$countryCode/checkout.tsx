import { createFileRoute } from "@tanstack/react-router";
import Checkout from "@/pages/checkout";

export const Route = createFileRoute("/$countryCode/checkout")({
  component: Checkout,
});