# Links

## Readonly Links

Readonly links allow you to establish a relationship between two entities where modifications can only be made through the primary entity. This is useful when you want to prevent direct manipulation of the relationship from the secondary entity.

For example:

```ts
import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductReviewModule from "../modules/product-review";

export default defineLink(
  {
    linkable: ProductReviewModule.linkable.productReview, // Link to the ProductReview entity
    field: "product_id", // The foreign key field on ProductReview
    isList: false, // A review belongs to one product
  },
  ProductModule.linkable.product, // Link to the core Product entity
  {
    readOnly: true, // Creates a readonly link
  }
);
```

In this example, the link between a product review and a product is readonly, meaning the relationship can only be modified through the product review entity, not through the product entity.

The `readOnly: true` configuration means Medusa won't create a separate link table in the database. Instead, it uses the ID stored in your specified field (e.g., `product_id` or `customer_id`) to retrieve the linked record [Read-Only Module Link](https://docs.medusajs.com/learn/fundamentals/module-links/read-only).

## Module Links

A module link forms an association between two data models of different modules, while maintaining module isolation.

> Learn more about links in [this documentation](https://docs.medusajs.com/learn/fundamentals/module-links)

For example:

```ts
import BlogModule from "../modules/blog";
import ProductModule from "@medusajs/medusa/product";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  ProductModule.linkable.product,
  BlogModule.linkable.post
);
```

This defines a link between the Product Module's `product` data model and the Blog Module (custom module)'s `post` data model.

Then, in the Medusa application, run the following command to sync the links to the database:

```bash
npx medusa db:migrate
```
