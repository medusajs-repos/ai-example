/**
 * Query Key Factory for TanStack Query
 * 
 * This factory provides a centralized way to manage query keys across the application.
 * It ensures consistency and makes it easier to invalidate related queries.
 */

import { Query } from "@tanstack/react-query"

// Generic domain factory function
const createDomainKeys = (domain: string) => ({
  all: [domain] as const,
  list: (...params: any[]) => [domain, "list", ...params] as const,
  detail: (id: string, ...params: any[]) => [domain, "detail", id, ...params] as const,
  // Dynamic property for custom keys
  [Symbol.for("dynamic")]: (key: string, ...params: any[]) => [domain, key, ...params] as const,
  predicate: (
    query: Query,
    excludeKeys?: string[],
  ): boolean => {
    let hasExcludedKeys = false
    if (excludeKeys) {
      hasExcludedKeys = excludeKeys.some(key => query.queryKey?.includes(key))
    }
    return !hasExcludedKeys && query.queryKey?.includes(domain)
  },
})

// Helper function to create dynamic keys
const createDynamicKey = (domain: string, key: string, ...params: any[]) => 
  [domain, key, ...params] as const

export const queryKeys = {
  // Cart related queries
  cart: {
    ...createDomainKeys("cart"),
    current: (fields?: string) => [...queryKeys.cart.all, fields] as const,
  },

  // Customer related queries
  customer: {
    ...createDomainKeys("customer"),
    current: () => [...queryKeys.customer.all] as const,
    orders: () => createDynamicKey("customer", "orders"),
  },

  // Product related queries
  products: {
    ...createDomainKeys("products"),
    related: (productId: string, regionId?: string) => 
      createDynamicKey("products", "related", productId, regionId),
    latest: (limit?: number, regionId?: string) => 
      createDynamicKey("products", "latest", limit, regionId),
  },

  // Order related queries
  orders: {
    ...createDomainKeys("orders"),
  },

  // Region related queries
  regions: {
    ...createDomainKeys("regions"),
  },

  // Custom API queries
  custom: {
    ...createDomainKeys("custom"),
    get: (url: string) => createDynamicKey("custom", "get", url),
  },

  // Collections related queries
  collections: {
    ...createDomainKeys("collections"),
  },

  // Categories related queries
  categories: {
    ...createDomainKeys("categories"),
  },

  // Brands related queries
  brands: {
    ...createDomainKeys("brands"),
  },

  // Payment related queries
  payments: {
    ...createDomainKeys("payments"),
    sessions: (regionId?: string) => createDynamicKey("payments", "sessions", regionId),
    session: (sessionId: string) => 
      createDynamicKey("payments", "session", sessionId),
  },

  // Shipping related queries
  shipping: {
    ...createDomainKeys("shipping"),
    options: (cartId: string, regionId?: string) => 
      createDynamicKey("shipping", "options", cartId, regionId),
  },
} as const

/**
 * Helper function to get all query keys for a specific domain
 * Useful for invalidating all queries related to a specific feature
 */
export const getDomainKeys = {
  cart: () => queryKeys.cart.all,
  customer: () => queryKeys.customer.all,
  products: () => queryKeys.products.all,
  orders: () => queryKeys.orders.all,
  regions: () => queryKeys.regions.all,
  custom: () => queryKeys.custom.all,
  collections: () => queryKeys.collections.all,
  categories: () => queryKeys.categories.all,
  brands: () => queryKeys.brands.all,
  payments: () => queryKeys.payments.all,
  shipping: () => queryKeys.shipping.all,
} as const

/**
 * Utility function to create dynamic query keys for any domain
 * This allows you to create custom keys on the fly
 */
export const createQueryKey = (domain: string, key: string, ...params: any[]) => 
  [domain, key, ...params] as const

/**
 * Type definitions for better TypeScript support
 */
export type QueryKeys = typeof queryKeys;
export type DomainKeys = typeof getDomainKeys;
