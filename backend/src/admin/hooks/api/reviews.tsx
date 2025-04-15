import { ClientHeaders, FetchError } from "@medusajs/js-sdk";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  AdminProductReviewResponse,
  AdminProductReviewsResponse,
  AdminUpdateProductReview,
  ProductReviewFilterParams,
} from "../../../types";
import { sdk } from "../../lib/client";
import { queryKeysFactory } from "../../lib/query-key-factory";

export const reviewQueryKey = queryKeysFactory("product_review");

export const useAdminReviews = (
  query?: ProductReviewFilterParams,
  options?: UseQueryOptions<
    AdminProductReviewsResponse,
    FetchError,
    AdminProductReviewsResponse,
    QueryKey
  >
) => {
  const fetchReviews = (
    query?: ProductReviewFilterParams,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminProductReviewsResponse>(`/admin/reviews`, {
      query,
      headers,
    });

  const { data, ...rest } = useQuery({
    queryKey: reviewQueryKey.list(query),
    queryFn: () => fetchReviews(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useAdminReview = (
  id: string,
  query?: Record<string, any>,
  options?: UseQueryOptions<
    AdminProductReviewResponse,
    FetchError,
    AdminProductReviewResponse,
    QueryKey
  >
) => {
  const fetchReview = (
    id: string,
    query?: Record<string, any>,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminProductReviewResponse>(`/admin/reviews/${id}`, {
      query,
      headers,
    });

  const { data, ...rest } = useQuery({
    queryKey: reviewQueryKey.detail(id),
    queryFn: () => fetchReview(id, query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useAdminUpdateReview = (
  id: string,
  options?: UseMutationOptions<
    AdminProductReviewResponse,
    FetchError,
    AdminUpdateProductReview
  >
) => {
  const queryClient = useQueryClient();

  const updateReview = (
    payload: AdminUpdateProductReview,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminProductReviewResponse>(`/admin/reviews/${id}`, {
      method: "POST",
      body: payload,
      headers,
    });

  return useMutation({
    mutationFn: (payload: AdminUpdateProductReview) => updateReview(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: reviewQueryKey.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: reviewQueryKey.detail(id),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useAdminDeleteReview = (
  id: string,
  options?: UseMutationOptions<{
    id: string;
    object: string;
    deleted: boolean;
  }>
) => {
  const queryClient = useQueryClient();

  const deleteReview = (headers?: ClientHeaders) =>
    sdk.client.fetch<{
      id: string;
      object: string;
      deleted: boolean;
    }>(`/admin/reviews/${id}`, {
      method: "DELETE",
      headers,
    });

  return useMutation({
    mutationFn: () => deleteReview(),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: reviewQueryKey.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: reviewQueryKey.detail(id),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
