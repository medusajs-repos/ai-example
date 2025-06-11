import { InjectTransactionManager, MedusaContext, MedusaService } from "@medusajs/framework/utils";
import ProductReview from "./models/product-review";
import { Context, DAL, InternalModuleDeclaration } from "@medusajs/framework/types";

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService;
}

class ProductReviewModuleService extends MedusaService({
  ProductReview,
}) {
  protected baseRepository_: DAL.RepositoryService

  constructor(
    { baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
  }

  /**
   * Calculates the average rating for a given product.
   * @param productId - The ID of the product.
   * @returns The average rating or 0 if no reviews exist.
   */
  async getAverageRating(productId: string): Promise<number> {
    const reviews = await super.listProductReviews({ product_id: productId });

    if (reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    return totalRating / reviews.length;
  }

  @InjectTransactionManager()
  async approveReview(reviewId: string, @MedusaContext() sharedContext: Context) {
    const review = await super.retrieveProductReview(reviewId, {}, sharedContext);
    review.approved_at = new Date();
    const updatedReview = await super.updateProductReviews({ id: reviewId, approved_at: review.approved_at }, sharedContext);
    return await this.baseRepository_.serialize(updatedReview);
  }

  @InjectTransactionManager()
  async rejectReview(reviewId: string, @MedusaContext() sharedContext: Context) {
    const review = await super.retrieveProductReview(reviewId, {}, sharedContext);
    review.rejected_at = new Date();
    const updatedReview = await super.updateProductReviews({ id: reviewId, rejected_at: review.rejected_at }, sharedContext);
    return await this.baseRepository_.serialize(updatedReview);
  }
}

export default ProductReviewModuleService;
