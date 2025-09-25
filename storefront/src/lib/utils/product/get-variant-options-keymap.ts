import { HttpTypes } from "@medusajs/types"

/**
 * Creates a key-value mapping of variant options for easy lookup.
 * Maps option IDs to their corresponding values.
 * 
 * @param variantOptions - Array of variant option objects
 * @returns Object mapping option IDs to option values, or empty object if no options
 * 
 * @example
 * ```typescript
 * const options = [
 *   { option_id: "color", value: "red" },
 *   { option_id: "size", value: "large" }
 * ];
 * const keymap = getVariantOptionsKeymap(options);
 * // Returns: { color: "red", size: "large" }
 * 
 * // Usage in component
 * const selectedColor = keymap.color; // "red"
 * const selectedSize = keymap.size; // "large"
 * ```
 */
export default function getVariantOptionsKeymap(
  variantOptions: HttpTypes.StoreProductVariant["options"]
): Record<string, string> | undefined {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
};