import {
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import { listStoreReviewsTransformQueryConfig } from "./query-config";
import {
  StoreCreateProductReview,
  StoreGetProductReviewsParams,
} from "./validators";

export const storeReviewsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/products/:id/reviews",
    middlewares: [
      validateAndTransformQuery(
        StoreGetProductReviewsParams,
        listStoreReviewsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/products/:id/reviews",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformBody(StoreCreateProductReview),
    ],
  },
];
