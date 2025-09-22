import Home from "@/pages/home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$countryCode/")({
  head: () => {
    const title = `Welcome to Medusa Store`;
    const description = `Discover our curated collection of products. Browse our latest featured items and shop with confidence.`;

    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: title,
        },
        {
          property: "twitter:description",
          content: description,
        },
      ]
    };
  },
  component: Home,
});
