import {
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import {
  listAdminReviewsTransformQueryConfig,
  retrieveAdminReviewTransformQueryConfig,
} from "./query-config";
import {
  AdminGetReviewParams,
  AdminGetReviewsParams,
  AdminUpdateReview,
} from "./validators";

export const adminReviewsMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/reviews*",
    middlewares: [authenticate("user", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/reviews",
    middlewares: [
      validateAndTransformQuery(
        AdminGetReviewsParams,
        listAdminReviewsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/reviews/:review_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetReviewParams,
        retrieveAdminReviewTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/reviews/:review_id",
    middlewares: [
      validateAndTransformBody(AdminUpdateReview),
      validateAndTransformQuery(
        AdminGetReviewParams,
        retrieveAdminReviewTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/reviews/:review_id",
    middlewares: [],
  },
];
