import { defineMiddlewares } from "@medusajs/framework/http";
import { adminMiddlewares } from "./admin/middlewares";
import { storeMiddlewares } from "./store/middlewares";

export default defineMiddlewares({
  routes: [...adminMiddlewares, ...storeMiddlewares],
});
