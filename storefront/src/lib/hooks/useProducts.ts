import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { listProducts, retrieveProduct } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"

export const useRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: listRegions,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export const useProducts = ({
  queryParams,
  regionId,
}: {
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  regionId?: string
} = {}) => {
  return useInfiniteQuery({
    queryKey: ["products", queryParams, regionId],
    queryFn: ({ pageParam = 1 }) =>
      listProducts({
        pageParam,
        queryParams,
        regionId,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!regionId,
  })
}

export const useProduct = (handle: string, regionId?: string) => {
  return useQuery({
    queryKey: ["product", handle, regionId],
    queryFn: () => retrieveProduct(handle, regionId),
    enabled: !!handle && !!regionId,
  })
}

export const useLatestProducts = ({
  limit = 4,
  regionId,
}: {
  limit?: number
  regionId?: string
} = {}) => {
  return useQuery({
    queryKey: ["latest-products", limit, regionId],
    queryFn: () =>
      listProducts({
        queryParams: { 
          limit,
          order: "-created_at"
        },
        regionId,
      }),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}