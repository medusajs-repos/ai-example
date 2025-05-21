import { LoaderOptions } from "@medusajs/framework/types";

export default async function customLoader({ container }: LoaderOptions) {
  // connection to and external database
  const apiClient = {
    async ping() {
      return "pong";
    },
  };

  container.register("customDataStorage", apiClient);
}
