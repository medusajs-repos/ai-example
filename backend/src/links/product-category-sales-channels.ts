import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import SalesChannelModule from "@medusajs/medusa/sales-channel";

export default defineLink(ProductModule.linkable.productCategory.id, {
  likable: SalesChannelModule.linkable.salesChannel.id,
  isList: true,
});
