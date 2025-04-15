export const adminReviewFields = [
  "id",
  "product_id",
  "customer_id",
  "rating",
  "title",
  "content",
  "created_at",
  "updated_at",
  "*customer", // Derived from readonly link between product_review and customer
  "*product", // Derived from readonly link between product_review and product
];

export const listAdminReviewsTransformQueryConfig = {
  defaults: adminReviewFields,
  isList: true,
};

export const retrieveAdminReviewTransformQueryConfig = {
  defaults: adminReviewFields,
  isList: false,
};
