import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.StoreProductListParams;
  regionId?: string;
}): Promise<{
  products: HttpTypes.StoreProduct[];
  count: number;
  nextPage: number | null;
}> => {
  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  const response = await sdk.store.product.list({
    limit,
    offset,
    region_id: regionId,
    ...queryParams,
  })

  const nextPage = offset + limit < response.count ? _pageParam + 1 : null;

  return {
    products: response.products,
    count: response.count,
    nextPage,
  };
};

export const retrieveProduct = async ({
  handle,
  regionId,
  fields,
}: {
  handle: string;
  regionId?: string;
  fields?: string;
}): Promise<HttpTypes.StoreProduct> => {
  const { products } = await sdk.store.product.list({
    handle: handle,
    region_id: regionId,
    fields: fields ||
      "*variants, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder, *images, *options, *options.values, *collection, *tags",
  });

  if (!products || products.length === 0) {
    throw new Error(`Product with handle ${handle} not found`);
  }

  const product = products[0];

  return product;
};
