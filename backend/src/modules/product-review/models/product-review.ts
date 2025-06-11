import { model } from "@medusajs/framework/utils";

const ProductReview = model.define("product_review", {
  id: model.id({ prefix: "prdreview" }).primaryKey(),
  product_id: model.text(), // Link established in src/links/review-product.ts
  customer_id: model.text(), // Link established in src/links/review-customer.ts
  rating: model.number(),
  title: model.text().nullable(),
  content: model.text(),
  approved_at: model.dateTime().nullable(),
  rejected_at: model.dateTime().nullable(),
});

export default ProductReview;
