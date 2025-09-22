import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { sendGetRequest } from "@/lib/data/custom"
import { FetchArgs } from "@medusajs/js-sdk"

export const useGetDataDynamic = ({
  url,
  data,
}: {
  url: string;
  data?: FetchArgs;
}) => {
  return useQuery({
    queryKey: queryKeys.custom.get(url),
    queryFn: () => sendGetRequest(url, data),
    staleTime: 0,
  })
}
