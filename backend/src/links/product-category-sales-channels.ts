import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import SalesChannelModule from "@medusajs/medusa/sales-channel";

export default defineLink(
  ProductModule.linkable.productCategory.id, // Link to the ProductCategory entity
  {
    likable: SalesChannelModule.linkable.salesChannel.id, // Link to the SalesChannel entity
    isList: true, // A product category can be associated with multiple sales channels
  }
);
