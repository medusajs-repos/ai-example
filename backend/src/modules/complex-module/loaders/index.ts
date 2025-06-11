import { LoaderOptions } from "@medusajs/framework/types";
import { asValue } from "awilix";

export default async function customLoader({ container }: LoaderOptions) {
  // connection to and external database
  const apiClient = {
    async ping() {
      return "pong";
    },
  };

  container.register("customDataStorage", asValue(apiClient));
}
