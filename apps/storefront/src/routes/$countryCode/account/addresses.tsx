import { createFileRoute } from "@tanstack/react-router"
import AccountAddresses from "@/pages/account-addresses"

export const Route = createFileRoute("/$countryCode/account/addresses")({
  component: AccountAddresses,
})