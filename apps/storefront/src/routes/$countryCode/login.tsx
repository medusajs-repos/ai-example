import { createFileRoute, redirect } from "@tanstack/react-router"
import Login from "@/pages/login"
import { queryKeys } from "@/lib/utils/common/query-keys"
import { retrieveCustomer } from "@/lib/data/customer"

export const Route = createFileRoute("/$countryCode/login")({
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
      })
    } catch {
      // do nothing, user is not logged in
    }
  },
  component: Login,
})