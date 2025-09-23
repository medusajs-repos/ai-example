import { createFileRoute, notFound } from "@tanstack/react-router"
import Checkout, { CheckoutStep } from "@/pages/checkout"
import { getRegion } from "@/lib/data/regions"

export const Route = createFileRoute("/$countryCode/checkout")({
  validateSearch: (search) => {
    let step = search.step
    if (!Object.values(CheckoutStep).includes(step as CheckoutStep)) {
      step = "addresses"
    }
    return {
      step,
    }
  },
  loaderDeps: ({ search: { step } }) => {
    return {
      step,
    }
  },
  loader: async ({ params, context, deps }) => {
    const { countryCode } = params
    const { queryClient } = context
    const { step } = deps

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    })

    if (!region) {
      throw notFound()
    }

    return {
      region,
      countryCode,
      step,
    }
  },
  component: Checkout,
})