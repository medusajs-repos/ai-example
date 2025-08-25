import { createFileRoute } from "@tanstack/react-router";
import AccountProfile from "../../../pages/AccountProfile";

export const Route = createFileRoute("/$countryCode/account/profile")({
  component: AccountProfile,
});