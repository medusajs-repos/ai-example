import RegionRedirect from "@/components/RegionRedirect";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => {
    return <RegionRedirect />;
  },
});
