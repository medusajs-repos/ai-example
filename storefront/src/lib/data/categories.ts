import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export const retrieveCategory = async (
  handle: string
): Promise<HttpTypes.StoreProductCategory | null> => {
  try {
    const { product_categories } = await sdk.store.category.list({
      handle: handle,
    });

    if (!product_categories || product_categories.length === 0) {
      throw new Error(`Category with handle ${handle} not found`);
    }

    return product_categories[0];
  } catch (error) {
    console.error(`Failed to fetch category ${handle}:`, error);
    throw new Error(`Category with handle ${handle} not found`);
  }
};

export const listCategories = async (options?: {
  fields?: string;
}): Promise<HttpTypes.StoreProductCategory[]> => {
  try {
    const { product_categories } = await sdk.store.category.list({
      fields: options?.fields,
    });

    return product_categories || [];
  } catch (error) {
    return [];
  }
};
