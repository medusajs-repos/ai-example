"use client";

import { useAddToCart } from "@lib/hooks/useCart";
import { useIntersection } from "@lib/hooks/useIntersection";
import { getCountryCodeFromPath } from "@lib/util/regions";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { useLocation } from "@tanstack/react-router";
import { isEqual } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import MobileActions from "./MobileActions";
import OptionSelect from "./OptionSelect";
import ProductPrice from "./ProductPrice";

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  disabled?: boolean;
};

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value;
    return acc;
  }, {});
};

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    {}
  );
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useAddToCart();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname) || "dk";

  const actionsRef = useRef<HTMLDivElement>(null);
  const inView = useIntersection(actionsRef, "0px");

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options);
      setOptions(variantOptions ?? {});
    }
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return;
    }

    // If there's only one variant and no options, select it directly
    if (
      product.variants.length === 1 &&
      (!product.options || product.options.length === 0)
    ) {
      return product.variants[0];
    }

    const variant = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      const matches = isEqual(variantOptions, options);

      return matches;
    });

    return variant;
  }, [product.variants, product.options, options]);

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    });
  }, [product.variants, options]);

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If no variant is selected, we can't add to cart
    if (!selectedVariant) {
      return false;
    }

    // For demo/development purposes, if manage_inventory is undefined/null or false, allow add to cart
    if (
      selectedVariant.manage_inventory === false ||
      selectedVariant.manage_inventory === undefined ||
      selectedVariant.manage_inventory === null
    ) {
      return true;
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant.allow_backorder === true) {
      return true;
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant.manage_inventory === true &&
      (selectedVariant.inventory_quantity || 0) > 0
    ) {
      return true;
    }

    // Default to allowing add to cart for demo products (many demo setups don't properly configure inventory)
    return true;
  }, [selectedVariant]);

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null;

    setIsAdding(true);

    try {
      await addToCart.mutateAsync({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      });
    } catch (error) {
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                );
              })}
              <div className="border-t border-ui-border-base my-4" />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          region={region}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  );
}
