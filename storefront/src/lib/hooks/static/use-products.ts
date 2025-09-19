import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { listProducts, retrieveProduct } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"

export const useProducts = ({
  queryParams,
  regionId,
}: {
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  regionId?: string
} = {}) => {
  return useInfiniteQuery({
    queryKey: ["products", queryParams, regionId],
    queryFn: ({ pageParam }) =>
      listProducts({
        pageParam,
        queryParams,
        regionId,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.nextPage,
    initialPageParam: 1,
    enabled: !!regionId,
  })
}

export const useProduct = ({
  handle,
  regionId,
  fields,
}: {
  handle: string;
  regionId?: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: ["product", handle, regionId],
    queryFn: () => retrieveProduct({ handle, regionId, fields }),
    enabled: !!handle && !!regionId,
  })
}

export const useRelatedProducts = ({
  productId,
  regionId,
  collectionId,
  tags,
}: {
  productId: string;
  regionId?: string;
  collectionId?: string;
  tags?: string[];
}) => {
  return useQuery({
    queryKey: ["related-products", productId, regionId],
    queryFn: async () => {
      const params: any = {
        fields: "title, handle, *images, *variants",
        is_giftcard: false,
        limit: 4
      }
      
      if (collectionId) {
        params.collection_id = [collectionId]
      }
      
      if (tags && tags.length > 0) {
        params.tag_id = tags
      }
      
      const { products } = await listProducts({
        queryParams: params,
        regionId,
      })

      return products.filter((product) => product.id !== productId)
    },
    enabled: !!productId && !!regionId,
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
  })
}