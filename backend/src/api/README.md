# API Structure Best Practices

This document outlines the best practices and patterns used in our API implementation that can be replicated in similar projects.

## Directory Structure

```
api/
├── middlewares.ts                   # Root middleware aggregator
├── admin/                           # Admin-facing API endpoints
│   ├── middlewares.ts               # Admin middleware aggregator
│   └── [feature]/                   # Feature-specific admin endpoints
│       ├── middlewares.ts           # Feature-specific middleware definitions
│       ├── validators.ts            # Request validation schemas
│       └── query-config.ts          # Query field configurations
├── store/                           # Customer-facing API endpoints
│   ├── middlewares.ts               # Store middleware aggregator
│   └── [feature]/                   # Feature-specific store endpoints
│       ├── middlewares.ts           # Feature-specific middleware definitions
│       ├── validators.ts            # Request validation schemas
│       └── query-config.ts          # Query field configurations
│   └── [resource]/                  # Resource directories (e.g., products)
│       └── [id]/                    # Dynamic route segments
│           └── [sub-resource]/      # Nested resources (e.g., reviews)
│               └── route.ts         # HTTP method handlers (GET, POST, etc.)
```

## Key Best Practices

1. **Clear Separation of Concerns**

   - Admin and store APIs are cleanly separated
   - Each feature has its own directory with specialized files
   - Route handlers, validators, and query configurations are kept in separate files

2. **Middleware Pattern**

   - All routes are defined as middleware configurations
   - Middlewares are aggregated upward (feature → admin/store → root)
   - Authentication and validation are applied through middleware

3. **Strongly Typed Requests**

   - Zod schema validation for all inputs
   - TypeScript types derived from validation schemas
   - Proper typing for request objects

4. **REST API Best Practices**

   - Resource-based URL structure (/store/products/:id/reviews)
   - HTTP methods map to CRUD operations (GET, POST, etc.)
   - Consistent response format with metadata

5. **Query Configuration**

   - Defined field selections to control response shape
   - Default field configurations
   - Support for pagination and filtering

6. **Validation Strategy**

   - Input validation before processing requests
   - Parameter validation for query parameters
   - Body validation for POST/PUT requests
   - Type coercion where appropriate

7. **Authentication Integration**

   - Route-specific authentication requirements
   - Support for multiple auth strategies (session, bearer)
   - Role-based auth (customer, user)

8. **Workflow Pattern**
   - Business logic isolated in workflow modules
   - Clean separation between route handlers and business logic
   - Dependency injection via container scope

## Implementation Examples

### Middleware Definition

```typescript
export const storeReviewsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/products/:id/reviews",
    middlewares: [
      validateAndTransformQuery(
        StoreGetProductReviewsParams,
        listStoreReviewsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/products/:id/reviews",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformBody(StoreCreateProductReview),
      validateAndTransformQuery(
        StoreGetProductReviewsParams,
        retrieveStoreReviewsTransformQueryConfig
      ),
    ],
  },
];
```

### Route Handler

```typescript
export const GET = async (
  req: MedusaRequest<StoreGetProductReviewsParamsType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: reviews, metadata } = await query.graph({
    entity: "product_review",
    fields: req.queryConfig.fields,
    filters: { ...req.filterableFields, product_id: id },
    pagination: req.queryConfig.pagination,
  });

  res.json({
    reviews,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  });
};
```

### Workflow Route Examples

#### POST with Workflow

```typescript
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateProductType>,
  res: MedusaResponse
) => {
  // Extract data from request
  const data = req.validatedBody;
  const adminUserId = req.auth_context.actor_id;

  // Initialize the workflow
  const workflow = createProductWorkflow(req.scope);

  // Run the workflow with input data
  const { result } = await workflow.run({
    input: {
      ...data,
      created_by: adminUserId,
    },
  });

  // Return created resource
  res.status(201).json({ product: result });
};
```

#### DELETE with Workflow

```typescript
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // Extract parameters
  const { id } = req.params;
  const adminUserId = req.auth_context.actor_id;

  // Initialize the deletion workflow
  const workflow = deleteProductWorkflow(req.scope);

  // Execute the workflow
  await workflow.run({
    input: {
      product_id: id,
      deleted_by: adminUserId,
    },
  });

  // Return success with no content
  res.status(204).send();
};
```

### Validation Schema

```typescript
export const StoreGetProductReviewsParams = createFindParams({
  limit: 10,
  offset: 0,
}).merge(
  z.object({
    rating: z.coerce.number().min(1).max(5).optional(),
    created_at: z.date().optional(),
    q: z.string().optional(),
  })
);
```
