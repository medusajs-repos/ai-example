import RegionRedirect from "@/components/common/region-redirect";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RegionRedirect,
});
