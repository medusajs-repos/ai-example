import { defineConfig, loadEnv } from "@medusajs/framework/utils";
import { PRODUCT_REVIEW_MODULE } from "./src/modules/product-review"; // Added import

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  admin: {
    vite: () => {
      return {
        server: {
          allowedHosts: true,
          hmr: {
            timeout: 60000,
          },
        },
      };
    },
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    cookieOptions: {
      sameSite: "none",
      secure: true,
    },
  },
  modules: [
    {
      key: PRODUCT_REVIEW_MODULE,
      resolve: "./src/modules/product-review",
    },
  ],
});
