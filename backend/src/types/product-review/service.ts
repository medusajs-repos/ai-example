import {
  BaseFilterable,
  Context,
  FindConfig,
  IModuleService,
  RestoreReturn,
} from "@medusajs/types";
import {
  ModuleCreateProductReview,
  ModuleProductReview,
  ModuleUpdateProductReview,
} from "./module";

export interface ModuleProductReviewFilters
  extends BaseFilterable<ModuleProductReviewFilters> {
  q?: string;
  id?: string | string[];
  product_id?: string | string[];
  customer_id?: string | string[];
  rating?: number | number[];
}

/**
 * The main service interface for the ProductReview Module.
 */
export interface IProductReviewModuleService extends IModuleService {
  createProductReviews(
    data: ModuleCreateProductReview,
    sharedContext?: Context
  ): Promise<ModuleProductReview>;

  createProductReviews(
    data: ModuleCreateProductReview[],
    sharedContext?: Context
  ): Promise<ModuleProductReview[]>;

  retrieveProductReview(
    id: string,
    config?: FindConfig<ModuleProductReview>,
    sharedContext?: Context
  ): Promise<ModuleProductReview>;

  updateProductReviews(
    data: ModuleUpdateProductReview,
    sharedContext?: Context
  ): Promise<ModuleProductReview>;

  updateProductReviews(
    data: ModuleUpdateProductReview[],
    sharedContext?: Context
  ): Promise<ModuleProductReview[]>;

  listProductReviews(
    filters?: ModuleProductReviewFilters,
    config?: FindConfig<ModuleProductReview>,
    sharedContext?: Context
  ): Promise<ModuleProductReview[]>;

  listAndCountProductReviews(
    filters?: ModuleProductReviewFilters,
    config?: FindConfig<ModuleProductReview>,
    sharedContext?: Context
  ): Promise<[ModuleProductReview[], number]>;

  deleteProductReviews(ids: string[], sharedContext?: Context): Promise<void>;

  softDeleteProductReviews(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>;

  restoreProductReviews<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>;

  getAverageRating(productId: string): Promise<number>;

  approveProductReview(reviewId: string, sharedContext?: Context): Promise<ModuleProductReview>;

  rejectProductReview(reviewId: string, sharedContext?: Context): Promise<ModuleProductReview>;
}
