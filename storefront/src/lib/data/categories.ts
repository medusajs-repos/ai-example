import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";

export const retrieveCategory = async (
  handle: string
): Promise<HttpTypes.StoreProductCategory | null> => {
  try {
    const { product_categories } = await sdk.store.category.list({
      handle: handle,
    });

    if (!product_categories || product_categories.length === 0) {
      return null;
    }

    return product_categories[0];
  } catch (error) {
    return null;
  }
};

export const listCategories = async (): Promise<
  HttpTypes.StoreProductCategory[]
> => {
  try {
    const { product_categories } = await sdk.store.category.list({});

    return product_categories || [];
  } catch (error) {
    return [];
  }
};
