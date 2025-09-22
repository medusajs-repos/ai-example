import { useQuery } from "@tanstack/react-query";
import { retrieveProduct } from "../../data/products";

export const useProductDynamic = ({
  handle,
  region_id,
  fields,
}: {
  handle: string;
  region_id: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: ["product-dynamic", handle, region_id],
    queryFn: () => retrieveProduct({
      handle,
      region_id,
      fields: fields || "*variants, variants.inventory_quantity, variants.manage_inventory, variants.allow_backorder, *options, *options.values"
    }),
    staleTime: 0, // Don't cache
    enabled: !!handle && !!region_id,
  });
}