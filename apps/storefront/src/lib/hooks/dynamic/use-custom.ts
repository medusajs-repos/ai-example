import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/utils/common/query-keys"
import { sendGetRequest } from "@/lib/data/custom"
import { FetchArgs } from "@medusajs/js-sdk"

/**
 * React hook for making GET requests with no caching (always fresh data).
 * This is useful for data that changes frequently and should always be fetched fresh.
 * Uses Tanstack Query with staleTime: 0 to disable caching.
 * The JS SDK automatically handles JSON serialization for body parameters.
 * 
 * @param url - The API endpoint URL to fetch data from
 * @param data - Optional fetch arguments (query params, etc.)
 * @returns Tanstack Query result object with data, loading, error states
 * 
 * @example
 * ```typescript
 * // For real-time data that shouldn't be cached
 * const { data: liveInventory } = useGetDataDynamic<InventoryResponse>({
 *   url: '/store/products/prod_123/inventory'
 * });
 * 
 * // For search results that should always be fresh
 * const { data: searchResults } = useGetDataDynamic<SearchResponse>({
 *   url: '/store/search',
 *   data: {
 *     query: { q: searchTerm, limit: 20 }
 *   }
 * });
 * 
 * // For user-specific data with query parameters
 * const { data: userNotifications } = useGetDataDynamic<NotificationResponse>({
 *   url: '/store/customers/me/notifications',
 *   data: {
 *     query: { unread_only: true, limit: 10 }
 *   }
 * });
 * 
 * // For complex query parameters
 * const { data: liveData } = useGetDataDynamic<LiveDataResponse>({
 *   url: '/store/analytics/live',
 *   data: {
 *     query: { 
 *       time_range: { start: '2024-01-01', end: '2024-01-31' },
 *       metrics: ['sales', 'visitors'],
 *       group_by: 'day'
 *     }
 *   }
 * });
 * ```
 */
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
