import { createFileRoute, redirect } from "@tanstack/react-router"
import { queryKeys } from "@/lib/utils/common/query-keys"
import { retrieveCustomer } from "@/lib/data/customer"
import Register from "@/pages/register"

export const Route = createFileRoute("/$countryCode/register")({
  loader: async ({ params, context }) => {
    const { countryCode } = params
    const { queryClient } = context

    try {
      await queryClient.ensureQueryData({
        queryKey: queryKeys.customer.current(),
        queryFn: () => retrieveCustomer({ fields: "id, email" }),
      })

      throw redirect({
        to: `/${countryCode}/account` as any,
        replace: true
      })
    } catch {
      // do nothing, user is not logged in
    }
  },
  component: Register,
})
