import { FindParams, PaginatedResponse } from "@medusajs/types";
import { QueryProductReview } from "./query";
import { ModuleProductReviewFilters } from "./service";

/* Filters */

export interface ProductReviewFilterParams
  extends FindParams,
    ModuleProductReviewFilters {}

/* Admin */
export type AdminProductReviewResponse = {
  review: QueryProductReview;
};

export type AdminProductReviewsResponse = PaginatedResponse<{
  reviews: QueryProductReview[];
}>;

export type AdminUpdateProductReview = {
  rating?: number;
  title?: string | null;
  content?: string | null;
};

export type AdminCreateProductReview = {
  product_id: string;
  customer_id: string;
  rating: number;
  title?: string | null;
  content: string;
};

/* Store */

export type StoreProductReviewResponse = {
  review: QueryProductReview;
};

export type StoreProductReviewsResponse = PaginatedResponse<{
  reviews: QueryProductReview[];
}>;

export type StoreCreateProductReview = {
  rating: number;
  title?: string | null;
  content: string;
};
