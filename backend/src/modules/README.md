# Custom Module

A module is a package of reusable functionalities. It can be integrated into your Medusa application without affecting the overall system.

To create a module:

## 1. Create a Data Model

A data model represents a table in the database. You create a data model in a TypeScript or JavaScript file under the `models` directory of a module.

All models have by default the fields `created_at`, `updated_at` and `deleted_at`.

For example, create the file `src/modules/blog/models/post.ts` with the following content:

```ts
import { model } from "@medusajs/framework/utils";

const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
});

export default Post;
```

Here is an example of a model with all the possible properties, nothing else is supported:

```ts
import { model } from "@medusajs/framework/utils";
import RelatedModel from "./related-model";

const ComprehensiveModel = model
  .define("comprehensive_model", {
    // Primary key
    id: model.id({ prefix: "cm" }).primaryKey(),

    // ulid id field without prefix
    extra_id: model.id(),

    // Autoincrement
    ordering: model.autoincrement(),

    // Text properties
    title: model.text().searchable(),
    slug: model.text().unique(),
    description: model.text().nullable(),

    // Number properties
    count: model.number().default(0),
    rating: model.number().nullable(),

    // Big Number property
    price: model.bigNumber(),

    // Boolean properties
    isActive: model.boolean().default(true),
    isFeatured: model.boolean().default(false),

    // Enum property
    status: model.enum(["draft", "published", "archived"]).default("draft"),

    // DateTime properties
    createdAt: model.dateTime(),
    updatedAt: model.dateTime().nullable(),

    // JSON property
    metadata: model.json(),

    // Array property
    tags: model.array(),

    // Relationships
    relatedItems: model.hasMany(() => RelatedModel),
    parent: model.belongsTo(() => ComprehensiveModel, {
      nullable: true,
    }),
  })
  .indexes([
    // Composite index example
    {
      on: ["title", "status"],
      where: {
        isActive: true,
      },
    },
    // Unique composite index
    {
      on: ["slug", "status"],
      unique: true,
    },
  ]);

export default ComprehensiveModel;
```

## 2. Create a Service

A module must define a service. A service is a TypeScript or JavaScript class holding methods related to a business logic or commerce functionality.

For example, create the file `src/modules/blog/service.ts` with the following content:

```ts
import { MedusaService } from "@medusajs/framework/utils";
import Post from "./models/post";

class BlogModuleService extends MedusaService({
  Post,
}) {}

export default BlogModuleService;
```

## 3. Export Module Definition

A module must have an `index.ts` file in its root directory that exports its definition. The definition specifies the main service of the module.

For example, create the file `src/modules/blog/index.ts` with the following content:

```ts
import BlogModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const BLOG_MODULE = "blog";

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
});
```

## 4. Add Module to Medusa's Configurations

To start using the module, add it to `medusa-config.ts`:

```ts
module.exports = defineConfig({
  projectConfig: {
    // ...
  },
  modules: [
    {
      key: REVIEW_MODULE,
      resolve: "./src/modules/review",
    },
    // ...
  ],
});
```

## 5. Generate and Run Migrations

To generate migrations for your module, run the following command:

```bash
npx medusa db:generate blog
```

Then, to run migrations, run the following command:

```bash
npx medusa db:migrate
```

# Important Guidelines

- Models should always be a part of a module
- Never import models from another module or another package
- A module is an isolated set of logic
- A module service should only work with models within the module
- A module model is joined with other module models through workflows or links.
