import { createFileRoute, notFound } from "@tanstack/react-router"
import { getRegion } from "@/lib/data/regions"
import { sanitize } from "@/lib/utils/sanitize"
import Store from "@/pages/store"
import { listProducts } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@/lib/utils/option-value-query"

type StoreSearch = {
  [OPTION_VALUE_QUERY_KEY]?: string | string[]
}

export const Route = createFileRoute("/$countryCode/store")({
  validateSearch: (search: Record<string, unknown>): StoreSearch => {
    const raw = search[OPTION_VALUE_QUERY_KEY]
    if (Array.isArray(raw)) {
      return { [OPTION_VALUE_QUERY_KEY]: raw.map(String) }
    }
    if (typeof raw === "string") {
      return { [OPTION_VALUE_QUERY_KEY]: raw }
    }
    return {}
  },
  loaderDeps: ({ search }) => ({
    optionValueIds: parseOptionValueIds(
      search as Record<string, string | string[] | undefined>,
    ),
  }),
  loader: async ({ params, context, deps }) => {
    const { countryCode } = params
    const { queryClient } = context
    const { optionValueIds } = deps

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    })

    if (!region) {
      throw notFound()
    }

    const { products } = await queryClient.ensureQueryData({
      queryKey: ["products", { region_id: region.id, optionValueIds }],
      queryFn: () => listProducts({
        query_params: {
          limit: 100, // Reduce limit for SSR performance
          order: "-created_at"
        },
        region_id: region.id,
        optionValueIds,
      }),
    })

    return sanitize({
      countryCode,
      region,
      products: products as HttpTypes.StoreProduct[],
      optionValueIds,
    })
  },
  head: ({ loaderData }) => {
    const { region, countryCode } = loaderData || {}
    const regionName = region?.name || countryCode?.toUpperCase()
    const title = `Shop All Products - ${regionName} | Medusa Store`
    const description = `Browse our complete collection of products available in ${regionName}. Free shipping and easy returns.`

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
    }
  },
  component: Store,
})