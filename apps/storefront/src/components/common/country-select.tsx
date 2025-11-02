import { ChevronDownMini } from "@medusajs/icons";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { useUpdateCart } from "@/lib/hooks/dynamic/use-cart";
import { buildPathWithCountryCode } from "@/lib/utils/region/build-path-with-country-code";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { setStoredCountryCode } from "@/lib/utils/region/stored-country-code";
import { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for country/region selection in the storefront
 * - Header navigation: allow users to switch countries/regions
 * - Checkout pages: country selection for shipping and billing
 * - Account settings: user's preferred country/region
 * - Product pages: show region-specific pricing and availability
 * - Mobile commerce: mobile-optimized country selection
 *
 * ECOMMERCE CONTEXT:
 * - Critical for international commerce and localization
 * - Essential for region-specific pricing and shipping
 * - Important for currency and tax calculation
 * - Required for compliance with local regulations
 * - Used in cart management and checkout flow
 * - Important for user experience and conversion
 *
 * COUNTRY SELECT FEATURES:
 * - Dropdown with country flags and names
 * - Automatic cart region updates
 * - URL path updates for country-specific routing
 * - Smart dropdown positioning (above/below)
 * - Country code persistence
 * - Responsive design for mobile/desktop
 *
 * REGION HANDLING:
 * - Updates cart region when country changes
 * - Maintains URL structure with country codes
 * - Handles region-specific pricing and availability
 * - Manages currency and tax calculations
 *
 * COMMON PATTERNS:
 * - Header country selector
 * - Checkout country selection
 * - Mobile country picker
 * - Region-specific product display
 * - International shipping selection
 *
 * EXAMPLES:
 * - <CountrySelect regions={availableRegions} />
 * - <CountrySelect regions={regions} className="w-48" />
 * - Header country selector for international stores
 */

type CountryOption = {
  country_code: string;
  region_id: string;
  label: string;
  currency_code: string;
};

type CountrySelectProps = {
  regions: HttpTypes.StoreRegion[];
  className?: string;
};

const CountrySelect = ({ regions, className }: CountrySelectProps) => {
  const [currentCountry, setCurrentCountry] = useState<
    CountryOption | undefined
  >();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"below" | "above">(
    "below"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const pathCountryCode = getCountryCodeFromPath(location.pathname);
  const currentPath =
    location.pathname.replace(`/${pathCountryCode}`, "") || "/";

  const updateCartMutation = useUpdateCart();

  const countries = useMemo(() => {
    const countryMap = new Map<string, CountryOption>();

    regions?.forEach((region) => {
      region.countries?.forEach((country) => {
        if (country.iso_2 && !countryMap.has(country.iso_2)) {
          countryMap.set(country.iso_2, {
            country_code: country.iso_2,
            region_id: region.id,
            label: country.display_name ?? "",
            currency_code: region.currency_code?.toUpperCase() ?? "",
          });
        }
      });
    });

    return Array.from(countryMap.values()).sort((a, b) =>
      (a?.label ?? "").localeCompare(b?.label ?? "")
    );
  }, [regions]);

  useEffect(() => {
    if (pathCountryCode) {
      const option = countries?.find(
        (o) => o?.country_code === pathCountryCode
      );
      setCurrentCountry(option);
    }
  }, [countries, pathCountryCode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateDropdownPosition = () => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 240; // max-h-60 = 15rem = 240px

    // Check if there's enough space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition("above");
    } else {
      setDropdownPosition("below");
    }
  };

  const handleChange = async (countryCode: string) => {
    const option = countries?.find((o) => o?.country_code === countryCode);
    if (!option) return;
    // Update stored country code
    setStoredCountryCode(option.country_code);

    // Navigate to the new country path
    const newPath = buildPathWithCountryCode(currentPath, option.country_code);
    navigate({ to: newPath as any });

    if (currentCountry?.region_id !== option.region_id) {
      await updateCartMutation.mutateAsync({
        region_id: option.region_id,
      });
    }

    setIsOpen(false);
  };

  return (
    <div className={clsx("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          calculateDropdownPosition();
          setIsOpen(!isOpen);
        }}
        className="w-full text-left text-primary-text flex items-center gap-2 text-sm w-fit"
      >
        <span>
          {currentCountry
            ? `${currentCountry.label} (${currentCountry.currency_code})`
            : "Select country"}
        </span>
        <ChevronDownMini
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 bg-primary-bg border border-primary-border max-h-60 overflow-y-auto ${
            dropdownPosition === "above" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {countries?.map((country) => (
            <button
              key={country.country_code}
              type="button"
              onClick={() => handleChange(country.country_code)}
              className="w-full px-4 py-2 text-left hover:bg-primary-border text-sm"
            >
              {country.label} ({country.currency_code})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
