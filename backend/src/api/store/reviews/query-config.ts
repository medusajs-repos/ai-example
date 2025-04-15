export const storeReviewFields = [
  "id",
  "product_id",
  "customer_id",
  "rating",
  "title",
  "content",
  "created_at",
  "updated_at",
  "customer.id",
  "customer.email",
  "customer.first_name",
  "customer.last_name",
  "product.id",
  "product.title",
  "product.description",
];

export const listStoreReviewsTransformQueryConfig = {
  defaults: storeReviewFields,
  isList: true,
};

export const retrieveStoreReviewTransformQueryConfig = {
  defaults: storeReviewFields,
  isList: false,
};
