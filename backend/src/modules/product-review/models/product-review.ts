import { model } from "@medusajs/framework/utils";

const ProductReview = model.define("product_review", {
  id: model.id({ prefix: "prdreview" }).primaryKey(),
  product_id: model.text(), // Link established in src/links/review-product.ts
  customer_id: model.text(), // Link established in src/links/review-customer.ts
  rating: model.number(),
  title: model.text().nullable(),
  content: model.text(),
});

export default ProductReview;
