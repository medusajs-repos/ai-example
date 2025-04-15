import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import ProductReviewModule from "../modules/product-review";

export default defineLink(
  {
    linkable: ProductReviewModule.linkable.productReview, // Link to the ProductReview entity
    field: "customer_id", // The foreign key field on ProductReview
    isList: false, // A review belongs to one customer
  },
  CustomerModule.linkable.customer, // Link to the core Customer entity
  {
    readOnly: true, // Creates a readonly link
  }
);
