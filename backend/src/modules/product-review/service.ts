import { MedusaService } from "@medusajs/framework/utils";
import ProductReview from "./models/product-review";

class ProductReviewModuleService extends MedusaService({
  ProductReview,
}) {
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
}

export default ProductReviewModuleService;
