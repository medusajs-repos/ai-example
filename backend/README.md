# Medusa.js Backend

This is the backend service for the Medusa.js e-commerce platform.

## Project Documentation

For more detailed documentation on specific components, please refer to the following guides:

- [Modules Documentation](./src/modules/README.md) - Learn how to create and use custom modules
- [API Documentation](./src/api/README.md) - Guidelines for custom API endpoints
- [Admin Customization](./src/admin/README.md) - Information about admin panel customizations
- [Links Documentation](./src/links/README.md) - Module relationship definitions
- [Workflows Documentation](./src/workflows/README.md) - Business workflow implementation
- [Subscribers Documentation](./src/subscribers/README.md) - Event subscribers implementation
- [Jobs Documentation](./src/jobs/README.md) - Background job implementation
- [Scripts Documentation](./src/scripts/README.md) - Utility scripts information

## Frontend Documentation

For storefront development guidelines, please refer to the [Storefront README](../storefront/README.md).

## Project Structure

```
backend/
├── src/
│   ├── api/             # Custom API endpoints
│   ├── modules/         # Reusable business logic modules
│   ├── links/           # Module relationship definitions
│   ├── models/          # Data models
│   ├── admin/           # Admin panel customizations
│   ├── subscribers/     # Event subscribers
│   ├── workflows/       # Business workflows
│   ├── jobs/            # Background jobs
│   ├── scripts/         # Utility scripts
│   └── types/           # TypeScript type definitions
├── medusa-config.ts     # Main configuration file
└── package.json         # Dependencies and scripts
```

## Getting Started

1. Install dependencies:

   ```
   yarn install
   ```

2. Set up environment variables:

   ```
   cp .env.template .env
   ```

3. Start the development server:
   ```
   yarn start
   ```

For more information about Medusa.js, visit the [official documentation](https://docs.medusajs.com/).
