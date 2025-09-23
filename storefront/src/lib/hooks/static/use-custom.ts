import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sendDeleteRequest, sendGetRequest, sendPostRequest } from "@/lib/data/custom"
import { queryKeys } from "@/lib/query-keys"
import { FetchArgs } from "@medusajs/js-sdk"

/**
 * React hook for making GET requests with caching and automatic refetching.
 * Uses Tanstack Query for state management and caching.
 * The JS SDK automatically handles JSON serialization for body parameters.
 * 
 * @param url - The API endpoint URL to fetch data from
 * @param data - Optional fetch arguments (query params, etc.)
 * @returns Tanstack Query result object with data, loading, error states
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading, error } = useGetData<ProductListResponse>({
 *   url: '/store/products'
 * });
 * 
 * // With query parameters
 * const { data: filteredProducts } = useGetData<ProductListResponse>({
 *   url: '/store/products',
 *   data: {
 *     query: { limit: 10, category: 'electronics' }
 *   }
 * });
 * 
 * // With complex query parameters
 * const { data: searchResults } = useGetData<ProductListResponse>({
 *   url: '/store/products',
 *   data: {
 *     query: { 
 *       collection_id: ['col_123', 'col_456'],
 *       tag_id: ['tag_789'],
 *       price_range: { gte: 1000, lte: 5000 },
 *       order: '-created_at'
 *     }
 *   }
 * });
 * ```
 */
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

/**
 * React hook for making POST requests with automatic cache invalidation.
 * Uses Tanstack Query's useMutation for handling POST operations.
 * The JS SDK automatically handles JSON serialization for body parameters.
 * 
 * @param url - The API endpoint URL to send the POST request to
 * @param data - Optional fetch arguments (body, query, etc.)
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic POST request (JSON.stringify is handled automatically)
 * const createCartMutation = usePostData<CartResponse>({
 *   url: '/store/carts',
 *   data: {
 *     body: { region_id: 'reg_123' }
 *   }
 * });
 * 
 * // Usage in component
 * const handleCreateCart = () => {
 *   createCartMutation.mutate(undefined, {
 *     onSuccess: (data) => {
 *       console.log('Cart created:', data);
 *     },
 *     onError: (error) => {
 *       console.error('Failed to create cart:', error);
 *     }
 *   });
 * };
 * 
 * // With query parameters
 * const createWithParamsMutation = usePostData<CartResponse>({
 *   url: '/store/carts',
 *   data: {
 *     body: { region_id: 'reg_123' },
 *     query: { fields: '*items, shipping_methods' }
 *   }
 * });
 * 
 * // With dynamic data
 * const submitFormMutation = usePostData<FormResponse>({
 *   url: '/store/contact'
 * });
 * 
 * const handleSubmit = (formData: FormData) => {
 *   submitFormMutation.mutate(undefined, {
 *     mutationFn: () => sendPostRequest('/store/contact', {
 *       body: formData
 *     })
 *   });
 * };
 * ```
 */
export const usePostData = ({
  url,
  data,
}: {
  url: string;
  data?: FetchArgs;
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sendPostRequest(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.custom.get(url) })
    }
  })
}

/**
 * React hook for making DELETE requests with automatic cache invalidation.
 * Uses Tanstack Query's useMutation for handling DELETE operations.
 * The JS SDK automatically handles JSON serialization for body parameters.
 * 
 * @param url - The API endpoint URL to send the DELETE request to
 * @param data - Optional fetch arguments (body, query, etc.)
 * @returns Tanstack Query mutation object with mutate function and state
 * 
 * @example
 * ```typescript
 * // Basic DELETE request
 * const deleteItemMutation = useDeleteData({
 *   url: '/store/carts/cart_123/line-items/item_456'
 * });
 * 
 * // Usage in component
 * const handleDeleteItem = (itemId: string) => {
 *   deleteItemMutation.mutate(undefined, {
 *     onSuccess: () => {
 *       console.log('Item deleted successfully');
 *     },
 *     onError: (error) => {
 *       console.error('Failed to delete item:', error);
 *     }
 *   });
 * };
 * 
 * // With body for bulk operations (JSON.stringify is handled automatically)
 * const bulkDeleteMutation = useDeleteData<BulkDeleteResponse>({
 *   url: '/store/products',
 *   data: {
 *     body: { ids: ['prod_1', 'prod_2'] }
 *   }
 * });
 * 
 * const handleBulkDelete = (productIds: string[]) => {
 *   bulkDeleteMutation.mutate(undefined, {
 *     mutationFn: () => sendDeleteRequest('/store/products', {
 *       body: { ids: productIds }
 *     })
 *   });
 * };
 * 
 * // With query parameters
 * const deleteWithQueryMutation = useDeleteData({
 *   url: '/store/carts/cart_123/line-items',
 *   data: {
 *     query: { line_item_id: 'item_456' }
 *   }
 * });
 * ```
 */
export const useDeleteData = ({
  url,
  data,
}: {
  url: string;
  data?: FetchArgs;
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sendDeleteRequest(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.custom.get(url) })
    }
  })
}