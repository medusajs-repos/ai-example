# Admin Customizations

You can extend the Medusa Admin to add widgets and new pages. Your customizations interact with API routes to provide merchants with custom functionalities.

> Learn more about Admin Extensions in [this documentation](https://docs.medusajs.com/learn/fundamentals/admin).

## Example: Create a Widget

A widget is a React component that can be injected into an existing page in the admin dashboard.

For example, create the file `src/admin/widgets/product-widget.tsx` with the following content:

```tsx title="src/admin/widgets/product-widget.tsx"
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// The widget
const ProductWidget = () => {
  return (
    <div>
      <h2>Product Widget</h2>
    </div>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductWidget;
```

This inserts a widget with the text "Product Widget" at the end of a product's details page.

# Best Practices for LLM Integration in Admin Extensions

## Directory Structure

```
src/admin/
├── hooks/       # Custom React hooks for data fetching and logic
│   └── api/     # API-specific hooks (data fetching, mutations)
├── lib/         # Utility functions and shared client implementations
├── routes/      # Admin panel custom pages with their components
│   └── [feature]/
│       ├── components/  # Reusable UI components for the feature
│       ├── page.tsx     # Main page component with route configuration
│       └── [id]/        # Detail views for individual items
├── widgets/     # Injectable UI components for existing admin pages
└── tsconfig.json # TypeScript configuration
```

## API Client Configuration

- Create a client instance in `backend/src/admin/lib/client.ts` if it does not exist.
- Implement feature-specific API hooks in `backend/src/admin/hooks/api/[feature].tsx`

## Component Structure

1. **Widgets:**

   - Export default component with business logic
   - Export `config` using `defineWidgetConfig` with appropriate zone
   - Keep UI components small and focused
   - Leverage UI library components (`Container`, etc.)

2. **Routes:**
   - Export default page component
   - Export `config` using `defineRouteConfig` with label and icon
   - Implement proper loading states and error handling

## Data Fetching Pattern

- Use React Query patterns with `queryKeysFactory` for consistent caching
  - If no `backend/src/admin/lib/query-key-factory.ts` is present with `queryKeysFactory` in "codebase_context", create one.
- Always fetch existing Type for a model. If a model type does not exist, create one in the `backend/src/types/*` folder or in any related folder in "codebase_context"
- Always use sdk.client.fetch to query custom endpoints or existing sdk for core endpoints (ex: sdk.admin.product.list(...))

```tsx
// Custom hook example
export const useFeatureData = (params) => {
  return useQuery({
    queryKey: featureKeys.detail(params.id, params),
    queryFn: () => apiClient.getFeature(params),
  });
};

// Component implementation
const FeatureComponent = () => {
  const params = useParams();
  const { data, isLoading } = useFeatureData({ id: params.id });

  if (isLoading) return <LoadingState />;

  return <YourComponent data={data} />;
};
```

## TypeScript Best Practices

- Define clear interfaces for all data structures
- Use type-safe query keys with `TQueryKey` pattern
- Properly type API responses and request parameters
- Leverage TypeScript's inference where appropriate
- IMPORTANT: If no typescript type is found for the model, create one!

## UI Component Guidelines

- Follow the UI library patterns consistently
- Create reusable component abstractions for repeated patterns
- Implement proper loading and empty states
- Use system icons from the design system
