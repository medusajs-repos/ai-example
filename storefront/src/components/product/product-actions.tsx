
import { useAddToCart } from "@/lib/hooks/dynamic/use-cart";
import { useIntersection } from "@/lib/hooks/lib/use-intersection";
import { getCountryCodeFromPath } from "@/lib/utils/regions";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { useLocation } from "@tanstack/react-router";
import { isEqual } from 'lodash-es';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useProductDynamic } from "@/lib/hooks/dynamic/use-products";
import { Loading } from "@/components/common";
import getVariantOptionsKeymap from "@/lib/utils/products/get-variant-options-keymap";
import isVariantInStock from "@/lib/utils/products/is-variant-in-stock";

const ProductMobileActions = lazy(() => import("@/components/product/product-mobile-actions"));
const ProductPrice = lazy(() => import("@/components/product/product-price"));
const ProductOptionSelect = lazy(() => import("@/components/product/product-option-select"));

type ProductActionsProps = {
  handle: string;
  region: HttpTypes.StoreRegion;
  disabled?: boolean;
};

export default function ProductActions({
  handle,
  region,
  disabled,
}: ProductActionsProps) {
  const { data: product } = useProductDynamic({ 
    handle,
    region_id: region.id,
   })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | undefined>>(
    {}
  );
  const [isAdding, setIsAdding] = useState(false);
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname) || "dk";

  const addToCartMutation = useAddToCart();

  const actionsRef = useRef<HTMLDivElement>(null);
  const inView = useIntersection(actionsRef, "0px");

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product?.variants?.length === 1) {
      const optionsKeymap = getVariantOptionsKeymap(product?.variants?.[0]?.options ?? []);
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

    setIsAdding(true);

    try {
      await addToCartMutation.mutateAsync({
        variant_id: selectedVariant.id,
        quantity: 1,
        country_code: countryCode,
        product,
        variant: selectedVariant,
      });
    } catch (error) {
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };


  if (!product) {
    return <Loading />
  }

  return (
    <div className="flex flex-col gap-y-2" ref={actionsRef}>
      <div>
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <Suspense fallback={<Loading />}>
                    <ProductOptionSelect
                      option={option}
                      current={selectedOptions[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </Suspense>
                </div>
              );
            })}
            <div className="border-t border-ui-border-base my-4" />
          </div>
        )}
      </div>

      <Suspense fallback={<Loading />}>
        <ProductPrice product={product as HttpTypes.StoreProduct} variant={selectedVariant} />
      </Suspense>

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
        {!selectedVariant && !selectedOptions
          ? "Select variant"
          : !inStock || !isValidVariant
          ? "Out of stock"
          : "Add to cart"}
      </Button>
      <Suspense fallback={<Loading />}>
        <ProductMobileActions
          product={product}
          variant={selectedVariant}
          options={selectedOptions}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </Suspense>
    </div>
  );
}
