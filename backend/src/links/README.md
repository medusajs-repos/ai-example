# Module Links Guide

## Link Types

### Readonly Links

Readonly links create a relationship where modifications can only be made through the primary entity. The relationship uses a foreign key field on one entity that references the other.

**Pattern:**

```ts
import { defineLink } from "@medusajs/framework/utils";
import PrimaryModule from "@path/to/primary/module";
import SecondaryModule from "@path/to/secondary/module";

export default defineLink(
  {
    linkable: SecondaryModule.linkable.entityName, // The entity with the foreign key
    field: "primary_entity_id", // The foreign key field name
    isList: false, // Whether one entity links to many (true) or one (false)
  },
  PrimaryModule.linkable.entityName, // The entity being referenced
  {
    readOnly: true, // Makes this a readonly link
  }
);
```

When `readOnly: true` is specified, Medusa uses the ID stored in your foreign key field to retrieve the linked record without creating a separate link table.

### Standard Module Links

Standard module links create a one-to-one, one-to-many, many-to-one or many-to-many relationships between two data models of different modules.

**Pattern:**

```ts
import { defineLink } from "@medusajs/framework/utils";
import FirstModule from "@path/to/first/module";
import SecondModule from "@path/to/second/module";

// One-to-one relationship
export default defineLink(
  FirstModule.linkable.entityName,
  SecondModule.linkable.entityName
);

// One-to-many relationship
export default defineLink(FirstModule.linkable.entityName, {
  likable: SecondModule.linkable.entityName,
  isList: true,
});

// Many-to-one relationship
export default defineLink(
  {
    likable: FirstModule.linkable.entityName,
    isList: true,
  },
  SecondModule.linkable.entityName
);

// Many-to-many relationship
export default defineLink(
  {
    linkable: FirstModule.linkable.entityName,
    isList: true,
  },
  {
    likable: SecondModule.linkable.entityName,
    isList: true,
  }
);
```

This creates a bidirectional relationship with a join table in the database.

## Implementation Steps

1. Create a link file in your `links` directory using one of the patterns above
2. Sync the link to your database:
   ```bash
   npx medusa db:migrate
   ```

## Common Module Imports

- Core Product: `import ProductModule from "@medusajs/medusa/product";`
- Core Customer: `import CustomerModule from "@medusajs/medusa/customer";`
- Core Order: `import OrderModule from "@medusajs/medusa/order";`
- Custom modules: `import CustomModule from "../modules/custom-module";`
- Ask Kapa AI for more Core Modules

## Usage Notes

- Use readonly links when one entity should "own" the relationship
- Use standard links for many-to-many relationships or one-to-many relationships between modules with a pivot table
- Always specify the correct `isList` value based on cardinality
- Ensure the `field` name matches the actual foreign key in your entity
