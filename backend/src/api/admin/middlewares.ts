import { MiddlewareRoute } from "@medusajs/medusa";
import { adminReviewsMiddlewares } from "./reviews/middlewares";

export const adminMiddlewares: MiddlewareRoute[] = [...adminReviewsMiddlewares];
