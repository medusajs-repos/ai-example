import { Module } from "@medusajs/framework/utils";
import customLoader from "./loaders";
import { CustomModule } from "./service";

export const CUSTOM_MODULE = "CustomModule";

export default Module(CUSTOM_MODULE, {
  service: CustomModule,
  loaders: [customLoader],
});
