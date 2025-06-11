import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import SalesChannelModule from "@medusajs/medusa/sales-channel";

export default defineLink(ProductModule.linkable.productCategory.id, {
  linkable: SalesChannelModule.linkable.salesChannel.id,
  isList: true,
});
