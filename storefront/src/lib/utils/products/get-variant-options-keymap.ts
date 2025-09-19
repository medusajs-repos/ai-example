import { HttpTypes } from "@medusajs/types";

export default function getVariantOptionsKeymap(
  variantOptions: HttpTypes.StoreProductVariant["options"]
) {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value;
    return acc;
  }, {});
};