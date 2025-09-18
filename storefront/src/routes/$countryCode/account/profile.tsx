import { createFileRoute } from "@tanstack/react-router";
import AccountProfile from "@/pages/account-profile";

export const Route = createFileRoute("/$countryCode/account/profile")({
  component: AccountProfile,
});