#!/usr/bin/env tsx
import { HttpTypes } from "@medusajs/types";
import "dotenv/config";
import { writeFileSync } from 'fs';
import { join } from 'path';

export interface StaticRoute {
  path: string;
  priority: 'high' | 'medium' | 'low';
  lastModified?: string;
}

interface RouteGenerationOptions {
  outputFile?: string;
}

interface CrawledRoute {
  path: string;
  priority?: 'high' | 'medium' | 'low';
}

// Fetch-based data functions for Node.js environment
const MEDUSA_BACKEND_URL = process.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.VITE_MEDUSA_PUBLISHABLE_KEY || "";

async function fetchRegions() {
  const response = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY
    }
  });
  const data = await response.json();
  return (data.regions || []) as HttpTypes.StoreRegion[];
}

async function fetchCategories() {
  const response = await fetch(`${MEDUSA_BACKEND_URL}/store/product-categories`, {
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY
    }
  });
  const data = await response.json();
  return (data.product_categories || []) as HttpTypes.StoreProductCategory[];
}

async function fetchProducts() {
  const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products?fields=handle,updated_at`, {
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY
    }
  });
  const data = await response.json();
  return (data.products || []) as HttpTypes.StoreProduct[];
}

async function crawlStaticRoutes(): Promise<CrawledRoute[]> {
  const crawledRoutes: CrawledRoute[] = [];
  
  try {
    // Read route files to discover static routes
    const { readdirSync, readFileSync, statSync } = await import('fs');
    const { join } = await import('path');
    
    const routesDir = join(process.cwd(), 'src', 'routes');
    
    if (!statSync(routesDir).isDirectory()) {
      throw new Error('Routes directory not found');
    }
    
    // Discover static route files
    const routeFiles = readdirSync(routesDir, { recursive: true });
    
    for (const file of routeFiles) {
      if (typeof file === 'string' && file.endsWith('.tsx')) {
        const filePath = join(routesDir, file);
        const content = readFileSync(filePath, 'utf8');
        
        // Look for static route patterns
        const staticRouteMatches = content.match(/createFileRoute\(["']([^"']+)["']\)/g);
        
        if (staticRouteMatches) {
          for (const match of staticRouteMatches) {
            const routeMatch = match.match(/createFileRoute\(["']([^"']+)["']\)/);
            if (routeMatch) {
              const routePath = routeMatch[1];
              
              // Determine the actual route path to process
              let actualRoutePath: string | null = null;
              
              if (routePath.startsWith('/$countryCode/')) {
                // Extract base route from country-code specific routes
                actualRoutePath = routePath.replace('/$countryCode', '');
              } else if (!routePath.startsWith('/$countryCode/')) {
                // Use regular static routes as-is
                actualRoutePath = routePath;
              }
              
              // Process the route if it's valid
              if (actualRoutePath && 
                  !actualRoutePath.includes('$') && 
                  actualRoutePath !== '/') {
                
                // Determine priority based on route type
                let priority: 'high' | 'medium' | 'low' = 'low';
                
                if (['/store', '/login', '/cart', '/checkout'].includes(actualRoutePath)) {
                  priority = 'medium';
                } else if (actualRoutePath === '/health') {
                  priority = 'low';
                } else if (actualRoutePath.startsWith('/account')) {
                  priority = 'medium';
                }
                
                crawledRoutes.push({ path: actualRoutePath, priority });
              }
            }
          }
        }
      }
    }
    
    // Remove duplicates
    const uniqueRoutes = crawledRoutes.filter((route, index, self) => 
      index === self.findIndex(r => r.path === route.path)
    );
    
    console.log(`Crawled ${uniqueRoutes.length} static routes from filesystem`);
    
    return uniqueRoutes;
    
  } catch (error) {
    console.warn('Could not crawl routes from filesystem, using fallback routes');
    // Fallback to known static routes
    return [
      { path: '/health', priority: 'low' },
      { path: '/login', priority: 'medium' },
      { path: '/cart', priority: 'medium' },
      { path: '/store', priority: 'medium' },
      { path: '/checkout', priority: 'medium' },
      { path: '/account', priority: 'medium' },
      { path: '/account/profile', priority: 'medium' },
      { path: '/account/addresses', priority: 'medium' },
      { path: '/account/orders', priority: 'medium' }
    ];
  }
}

async function generateStaticRoutes(options: RouteGenerationOptions = {}): Promise<StaticRoute[]> {
  const {
    outputFile = 'static-routes.json'
  } = options;

  console.log('Starting static route generation...');
  
  const routes: StaticRoute[] = [];
  
  try {
    // Fetch all data in parallel for efficiency
    const [regions, categories, products] = await Promise.all([
      fetchRegions(),
      fetchCategories(),
      fetchProducts()
    ]);

    // Extract country codes from regions
    const countryCodes = regions
      .map(region => region.countries?.[0]?.iso_2?.toLowerCase())
      .filter(Boolean);

    console.log(`Found ${countryCodes.length} countries: ${countryCodes.join(', ')}`);

    // Generate base routes (without country codes) - these will redirect to country-specific routes
    const baseRoutes: StaticRoute[] = [
      {
        path: '/',
        priority: 'high',
        lastModified: new Date().toISOString()
      }
    ];

    // Add crawled static routes as base routes (without country codes)
    try {
      const crawledRoutes = await crawlStaticRoutes();
      
      for (const route of crawledRoutes) {
        // Skip routes that already have country codes or are dynamic
        if (!route.path.includes('/$countryCode/') && !route.path.includes('$')) {
          baseRoutes.push({
            path: route.path,
            priority: route.priority || 'low',
            lastModified: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.warn('Could not crawl static routes, continuing with manual routes only');
    }

    // Add base routes to final routes array
    routes.push(...baseRoutes);

    // Add base routes for products and categories (without country codes)
    // These will redirect to country-specific versions
    for (const category of categories) {
      if (category.handle) {
        routes.push({
          path: `/categories/${category.handle}`,
          priority: 'medium',
          lastModified: new Date().toISOString()
        });
      }
    }

    for (const product of products) {
      if (product.handle) {
        routes.push({
          path: `/products/${product.handle}`,
          priority: 'medium',
          lastModified: product.updated_at || new Date().toISOString()
        });
      }
    }

    // Generate country-specific routes for each country code
    for (const countryCode of countryCodes) {
      // Add country-specific home page
      routes.push({
        path: `/${countryCode}/`,
        priority: 'high',
        lastModified: new Date().toISOString()
      });

      // Add country-specific store page
      routes.push({
        path: `/${countryCode}/store`,
        priority: 'high',
        lastModified: new Date().toISOString()
      });

      // Add country-specific category routes
      for (const category of categories) {
        if (category.handle) {
          routes.push({
            path: `/${countryCode}/categories/${category.handle}`,
            priority: 'medium',
            lastModified: new Date().toISOString()
          });
        }
      }

      // Add country-specific product routes
      for (const product of products) {
        if (product.handle) {
          routes.push({
            path: `/${countryCode}/products/${product.handle}`,
            priority: 'medium',
            lastModified: product.updated_at || new Date().toISOString()
          });
        }
      }

      // Add country-specific versions of crawled base routes
      for (const baseRoute of baseRoutes) {
        // Skip the root route and routes that don't need country codes
        if (baseRoute.path !== '/' && !baseRoute.path.startsWith('/health')) {
          routes.push({
            path: `/${countryCode}${baseRoute.path}`,
            priority: baseRoute.priority,
            lastModified: new Date().toISOString()
          });
        }
      }
    }

    // Sort routes by priority and path for better organization
    routes.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.path.localeCompare(b.path);
    });

    // Write routes to file
    const outputPath = join(process.cwd(), outputFile);
    writeFileSync(outputPath, JSON.stringify(routes, null, 2));
    
    console.log(`Generated ${routes.length} static routes`);
    console.log(`- ${baseRoutes.length} base routes (without country codes)`);
    console.log(`- ${routes.length - baseRoutes.length} country-specific routes`);
    console.log(`Routes saved to: ${outputPath}`);

    return routes;

  } catch (error) {
    console.error('Failed to generate static routes:', error);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: RouteGenerationOptions = {};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const value = args[i + 1];
  
  switch (key) {
    case '--output':
      options.outputFile = value;
      break;
  }
}

// Execute the script
generateStaticRoutes(options)
  .then(() => {
    console.log('Static route generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Static route generation failed:', error);
    process.exit(1);
  });
