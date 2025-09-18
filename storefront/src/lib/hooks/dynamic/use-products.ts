import { useQuery } from "@tanstack/react-query";
import { retrieveProduct } from "../../data/products";

export const useProductDynamic = ({
  handle,
  regionId,
}: {
  handle: string;
  regionId: string;
}) => {
  return useQuery({
    queryKey: ["product-dynamic", handle, regionId],
    queryFn: () => retrieveProduct({
      handle,
      regionId,
      fields: "*variants, variants.inventory_quantity, variants.manage_inventory, variants.allow_backorder, *options, *options.values"
    }),
    staleTime: 0, // Don't cache
    enabled: !!handle && !!regionId,
  });
}