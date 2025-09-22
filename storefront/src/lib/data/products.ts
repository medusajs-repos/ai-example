import { sdk } from "@/lib/sdk";
import { HttpTypes } from "@medusajs/types";

export const listProducts = async ({
  page_param = 1,
  query_params,
  region_id,
}: {
  page_param?: number;
  query_params?: HttpTypes.StoreProductListParams;
  region_id?: string;
}): Promise<{
  products: HttpTypes.StoreProduct[];
  count: number;
  next_page: number | null;
}> => {
  const limit = query_params?.limit || 12;
  const _page_param = Math.max(page_param, 1);
  const offset = _page_param === 1 ? 0 : (_page_param - 1) * limit;

  const response = await sdk.store.product.list({
    limit,
    offset,
    region_id,
    ...query_params,
  })

  const next_page = offset + limit < response.count ? _page_param + 1 : null;

  return {
    products: response.products,
    count: response.count,
    next_page,
  };
};

export const retrieveProduct = async ({
  handle,
  region_id,
  fields,
}: {
  handle: string;
  region_id?: string;
  fields?: string;
}): Promise<HttpTypes.StoreProduct> => {
  const { products } = await sdk.store.product.list({
    handle: handle,
    region_id,
    fields: fields ||
      "*variants, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder, *images, *options, *options.values, *collection, *tags",
  });

  if (!products || products.length === 0) {
    throw new Error(`Product with handle ${handle} not found`);
  }

  return products[0];
};
