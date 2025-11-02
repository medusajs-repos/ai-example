import { DEFAULT_CART_DROPDOWN_FIELDS } from "@/components/cart/cart-dropdown";
import { Button } from "@/components/common/button";
import { useCartDrawer } from "@/lib/context/cart";
import { useAddToCart } from "@/lib/hooks/dynamic/use-cart";
import getVariantOptionsKeymap from "@/lib/utils/product/get-variant-options-keymap";
import isVariantInStock from "@/lib/utils/product/is-variant-in-stock";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { HttpTypes } from "@medusajs/types";
import { useLocation } from "@tanstack/react-router";
import { isEqual } from "lodash-es";
import { useEffect, useMemo, useRef, useState, memo } from "react";
import ProductPrice from "@/components/product/product-price";
import ProductOptionSelect from "@/components/product/product-option-select";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use on product detail pages for the main product interaction area
 * - Product pages: display variant selection and add-to-cart functionality
 * - Quick shop modals: show product actions in popup windows
 * - Product comparison: display actions for compared products
 * - Mobile product views: compact product interaction interface
 * - Featured products: show actions for highlighted products
 *
 * ECOMMERCE CONTEXT:
 * - Critical for product conversion and sales
 * - Essential for variant selection and customization
 * - Important for inventory management and stock checking
 * - Required for cart functionality and checkout flow
 * - Used in product recommendation systems
 * - Critical for mobile commerce experience
 *
 * KEY FEATURES:
 * - Variant selection (size, color, material, etc.)
 * - Stock availability checking
 * - Price display with variant-specific pricing
 * - Add to cart functionality with validation
 * - Loading states and error handling
 * - Toast notifications for user feedback
 *
 * VARIANT HANDLING:
 * - Automatically selects single variants
 * - Validates variant combinations
 * - Checks stock availability
 * - Updates pricing based on selection
 * - Handles out-of-stock scenarios
 *
 * EXAMPLES:
 * - <ProductActions handle="product-handle" region={region} />
 * - <ProductActions handle="featured-product" region={region} disabled={isLoading} />
 * - <ProductActions handle="quick-shop-item" region={region} />
 */

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  disabled?: boolean;
};

const ProductActions = memo(function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | undefined>
  >({});
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname) || "dk";

  const addToCartMutation = useAddToCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  });
  const { openCart } = useCartDrawer();

  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOptions({});
  }, [product?.handle]);

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product?.variants?.length === 1) {
      const optionsKeymap = getVariantOptionsKeymap(
        product?.variants?.[0]?.options ?? []
      );
      setSelectedOptions(optionsKeymap ?? {});
    }
  }, [product?.variants]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants || product?.variants.length === 0) {
      return;
    }

    // If there's only one variant and no options, select it directly
    if (
      product?.variants.length === 1 &&
      (!product?.options || product?.options.length === 0)
    ) {
      return product?.variants[0];
    }

    const variant = product?.variants.find((v) => {
      const optionsKeymap = getVariantOptionsKeymap(v?.options ?? []);
      const matches = isEqual(optionsKeymap, selectedOptions);

      return matches;
    });

    return variant;
  }, [product?.variants, product?.options, selectedOptions]);

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product?.variants?.some((v) => {
      const optionsKeymap = getVariantOptionsKeymap(v?.options ?? []);
      return isEqual(optionsKeymap, selectedOptions);
    });
  }, [product?.variants, selectedOptions]);

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If no variant is selected, we can't add to cart
    if (!selectedVariant) {
      return false;
    }

    return isVariantInStock(selectedVariant);
  }, [selectedVariant]);

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null;

    addToCartMutation.mutateAsync(
      {
        variant_id: selectedVariant.id,
        quantity: 1,
        country_code: countryCode,
        product,
        variant: selectedVariant,
        region,
      },
      {
        onSuccess: () => {
          console.log("Item added to cart");
          openCart();
        },
        onError: () => {
          console.error("Failed to add item to cart");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-2" ref={actionsRef}>
      <div>
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <ProductOptionSelect
                    option={option}
                    current={selectedOptions[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || addToCartMutation.isPending}
                  />
                </div>
              );
            })}
            <hr className="bg-primary-border my-4" />
          </div>
        )}
      </div>

      <ProductPrice
        product={product as HttpTypes.StoreProduct}
        variant={selectedVariant}
        priceProps={{
          textSize: "large",
        }}
      />

      <Button
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant || !!disabled || !isValidVariant}
        variant="primary"
        className="w-full"
        data-testid="add-product-button"
      >
        {!selectedVariant
          ? "Select variant"
          : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
      </Button>
    </div>
  );
});

export default ProductActions;
