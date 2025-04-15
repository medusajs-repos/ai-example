import { MiddlewareRoute } from "@medusajs/medusa";
import { storeReviewsMiddlewares } from "./reviews/middlewares"; // Add this line

export const storeMiddlewares: MiddlewareRoute[] = [
  ...storeReviewsMiddlewares, // Add this line
];
