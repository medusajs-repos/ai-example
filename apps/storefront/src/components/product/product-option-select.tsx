import { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";
import React from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for product variant selection in the storefront
 * - Product detail pages: variant selection (size, color, material)
 * - Product customization: product option selection
 * - Mobile commerce: mobile-optimized variant selection
 * - Product configuration: product option customization
 * - Product comparison: variant comparison and selection
 *
 * ECOMMERCE CONTEXT:
 * - Critical for product customization and personalization
 * - Essential for variant selection and inventory management
 * - Important for user experience and product configuration
 * - Required for product option management
 * - Used in product recommendation systems
 * - Important for mobile commerce experience
 *
 * OPTION SELECT FEATURES:
 * - Product option selection (size, color, material, etc.)
 * - Visual option buttons with selection states
 * - Disabled state handling for out-of-stock options
 * - Responsive design for mobile/desktop
 * - Clear option labeling and identification
 * - Professional option presentation
 *
 * OPTION TYPES:
 * - Size options: Small, Medium, Large, etc.
 * - Color options: Red, Blue, Green, etc.
 * - Material options: Cotton, Polyester, etc.
 * - Style options: Classic, Modern, etc.
 * - Custom options: personalized selections
 *
 * COMMON PATTERNS:
 * - Product variant selection
 * - Mobile option selection
 * - Product customization
 * - Option comparison
 * - Product configuration
 *
 * EXAMPLES:
 * - <ProductOptionSelect option={sizeOption} current={selectedSize} updateOption={handleSizeChange} title="Size" />
 * - <ProductOptionSelect option={colorOption} current={selectedColor} updateOption={handleColorChange} title="Color" />
 * - <ProductOptionSelect option={materialOption} current={selectedMaterial} updateOption={handleMaterialChange} title="Material" />
 */

type ProductOptionSelectProps = {
  option: HttpTypes.StoreProductOption;
  current: string | undefined;
  updateOption: (title: string, value: string) => void;
  title: string;
  disabled: boolean;
  "data-testid"?: string;
};

const ProductOptionSelect: React.FC<ProductOptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value);

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isActive = v === current;
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clsx(
                "border text-sm font-medium px-4 py-2.5 flex-1 rounded-base transition-all duration-200 ease-in-out",
                {
                  // Active state
                  "border-primary-text bg-secondary-bg text-primary-text shadow-sm":
                    isActive,
                  // Default state
                  "border-secondary-border bg-secondary-bg text-secondary-text":
                    !isActive,
                  // Hover states
                  "hover:bg-secondary-hover hover:border-primary-border-strong hover:text-primary-text":
                    !isActive && !disabled,
                  // Disabled state
                  "opacity-50 cursor-not-allowed": disabled,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductOptionSelect;
