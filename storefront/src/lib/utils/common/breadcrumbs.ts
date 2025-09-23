import { HttpTypes } from "@medusajs/types";
import { BreadcrumbItem } from "@/components/common/breadcrumbs";

/**
 * Generate breadcrumbs for a product page
 */
export const generateProductBreadcrumbs = (
  product: HttpTypes.StoreProduct,
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : "";
  const items: BreadcrumbItem[] = [];

  // Add store breadcrumb
  items.push({
    label: "Store",
    href: `${baseHref}/store`,
  });

  // Add collection breadcrumb if product has a collection
  if (product.collection) {
    items.push({
      label: product.collection.title,
      href: `${baseHref}/collections/${product.collection.handle}`,
    });
  }

  // Add product breadcrumb (current page)
  items.push({
    label: product.title,
    current: true,
  });

  return items;
};

/**
 * Generate breadcrumbs for a collection/category page
 */
export const generateCollectionBreadcrumbs = (
  collection: { title: string; handle: string },
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : "";
  
  return [
    {
      label: "Store",
      href: `${baseHref}/store`,
    },
    {
      label: collection.title,
      current: true,
    },
  ];
};

/**
 * Generate breadcrumbs for account pages
 */
export const generateAccountBreadcrumbs = (
  page: string,
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : "";
  
  const items: BreadcrumbItem[] = [
    {
      label: "Account",
      href: `${baseHref}/account`,
    },
  ];

  // Add specific page breadcrumb if not the main account page
  if (page !== "account") {
    items.push({
      label: page.charAt(0).toUpperCase() + page.slice(1),
      current: true,
    });
  }

  return items;
};

/**
 * Generate breadcrumbs for order pages
 */
export const generateOrderBreadcrumbs = (
  orderId?: string,
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : "";
  
  const items: BreadcrumbItem[] = [
    {
      label: "Account",
      href: `${baseHref}/account`,
    },
    {
      label: "Orders",
      href: `${baseHref}/account/orders`,
    },
  ];

  if (orderId) {
    items.push({
      label: `Order ${orderId}`,
      current: true,
    });
  }

  return items;
};

/**
 * Generate breadcrumbs for checkout pages
 */
export const generateCheckoutBreadcrumbs = (
  step?: string,
  countryCode?: string
): BreadcrumbItem[] => {
  const baseHref = countryCode ? `/${countryCode}` : "";
  
  const items: BreadcrumbItem[] = [
    {
      label: "Cart",
      href: `${baseHref}/cart`,
    },
  ];

  if (step) {
    items.push({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      current: true,
    });
  }

  return items;
};
