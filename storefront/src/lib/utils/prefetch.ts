import { QueryClient } from '@tanstack/react-query'
import { getProduct } from '@lib/data/products'
import { getRegions } from '@lib/data/regions'

export const prefetchProductData = async (
  queryClient: QueryClient,
  handle: string,
  regionId?: string
) => {
  // Prefetch regions if not available
  await queryClient.prefetchQuery({
    queryKey: ['regions'],
    queryFn: getRegions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Prefetch product data
  if (regionId) {
    await queryClient.prefetchQuery({
      queryKey: ['product', handle, regionId],
      queryFn: () => getProduct(handle, regionId),
      staleTime: 2 * 60 * 1000, // 2 minutes
    })
  }
}

export const getProductDataForSSR = async (handle: string, regionId?: string) => {
  try {
    const product = regionId ? await getProduct(handle, regionId) : null
    const regions = await getRegions()
    
    return {
      product,
      regions,
      error: null,
    }
  } catch (error) {
    return {
      product: null,
      regions: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}