import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";

export type SortOptions =
  | "price_asc"
  | "price_desc"
  | "title_asc"
  | "title_desc"
  | "created_at";

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  regionId?: string;
}): Promise<{
  products: HttpTypes.StoreProduct[];
  count: number;
  nextPage: number | null;
}> => {
  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  try {
    const searchParams = new URLSearchParams();
    searchParams.set("limit", String(limit));
    searchParams.set("offset", String(offset));

    if (regionId) {
      searchParams.set("region_id", regionId);
    }

    Object.entries(queryParams || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            searchParams.append(`${key}[]`, String(item));
          });
        } else {
          searchParams.set(key, String(value));
        }
      }
    });

    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[];
      count: number;
    }>(`/store/products?${searchParams}`, {
      method: "GET",
    });

    const nextPage = offset + limit < response.count ? _pageParam + 1 : null;

    return {
      products: response.products,
      count: response.count,
      nextPage,
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

export const retrieveProduct = async (
  handle: string,
  regionId?: string
): Promise<HttpTypes.StoreProduct> => {
  try {
    const { products } = await sdk.store.product.list({
      handle: handle,
      region_id: regionId,
      fields:
        "*variants, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder, *images, *options, *options.values, *collection, *tags",
    });

    if (!products || products.length === 0) {
      throw new Error(`Product with handle ${handle} not found`);
    }

    const product = products[0];

    return product;
  } catch (error) {
    console.error(`Failed to fetch product ${handle}:`, error);
    throw error;
  }
};

export const getProductsById = async ({
  ids,
  regionId,
}: {
  ids: string[];
  regionId?: string;
}): Promise<HttpTypes.StoreProduct[]> => {
  try {
    const searchParams = new URLSearchParams({
      id: ids,
      ...(regionId && { region_id: regionId }),
    } as any);

    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[];
    }>(`/store/products?${searchParams}`, {
      method: "GET",
    });

    return response.products;
  } catch (error) {
    console.error("Failed to fetch products by IDs:", error);
    throw error;
  }
};
