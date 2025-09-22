import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { listProducts, retrieveProduct } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { queryKeys } from "@/lib/query-keys"

export const useProducts = ({
  query_params,
  region_id,
}: {
  query_params?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  region_id?: string
} = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(query_params, region_id),
    queryFn: ({ pageParam }) =>
      listProducts({
        page_param: pageParam,
        query_params,
        region_id,
      }),
    getNextPageParam: (lastPage) => lastPage.next_page,
    getPreviousPageParam: (firstPage) => firstPage.next_page,
    initialPageParam: 1,
    enabled: !!region_id,
  })
}

export const useProduct = ({
  handle,
  region_id,
  fields,
}: {
  handle: string;
  region_id?: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.products.detail(handle, region_id),
    queryFn: () => retrieveProduct({ handle, region_id, fields }),
    enabled: !!handle && !!region_id,
  })
}

export const useRelatedProducts = ({
  product_id,
  region_id,
  collection_id,
  tags,
}: {
  product_id: string;
  region_id?: string;
  collection_id?: string;
  tags?: string[];
}) => {
  return useQuery({
    queryKey: queryKeys.products.related(product_id, region_id),
    queryFn: async () => {
      const params: Record<string, any> = {
        fields: "title, handle, *images, *variants",
        is_giftcard: false,
        limit: 4
      }
      
      if (collection_id) {
        params.collection_id = [collection_id]
      }
      
      if (tags && tags.length > 0) {
        params.tag_id = tags
      }
      
      const { products } = await listProducts({
        query_params: params,
        region_id,
      })

      return products.filter((product) => product.id !== product_id)
    },
    enabled: !!product_id && !!region_id,
  })
}

export const useLatestProducts = ({
  limit = 4,
  region_id,
}: {
  limit?: number
  region_id?: string
} = {}) => {
  return useQuery({
    queryKey: queryKeys.products.latest(limit, region_id),
    queryFn: () =>
      listProducts({
        query_params: { 
          limit,
          order: "-created_at"
        },
        region_id,
      }),
    enabled: !!region_id,
  })
}