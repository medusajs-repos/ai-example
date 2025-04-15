import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductReviewModule from "../modules/product-review";

export default defineLink(
  {
    linkable: ProductReviewModule.linkable.productReview, // Link to the ProductReview entity
    field: "product_id", // The foreign key field on ProductReview
    isList: false, // A review belongs to one product
  },
  ProductModule.linkable.product, // Link to the core Product entity
  {
    readOnly: true, // Creates a readonly link
  }
);
