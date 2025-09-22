import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sendDeleteRequest, sendGetRequest, sendPostRequest } from "@/lib/data/custom"
import { queryKeys } from "@/lib/query-keys"
import { FetchArgs } from "@medusajs/js-sdk"

export const useGetData = ({
  url,
  data,
}: {
  url: string;
  data?: FetchArgs;
}) => {
  return useQuery({
    queryKey: queryKeys.custom.get(url),
    queryFn: () => sendGetRequest(url, data),
  })
}

export const usePostData = ({
  url,
  data,
}: {
  url: string;
  data?: FetchArgs;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sendPostRequest(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.custom.get(url) });
    }
  })
}

export const useDeleteData = ({
  url,
  data,
}: {
  url: string;
  data?: FetchArgs;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sendDeleteRequest(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.custom.get(url) });
    }
  })
}