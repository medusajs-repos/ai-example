# Storefront Development Guidelines

## Important Rules

These guidelines must be strictly followed when developing the storefront:

### 1. No Translations or Internationalization

- DO NOT use translations or internationalization in the storefront codebase even if the codebase is internationalized.
- Example: Avoid using `useTranslations` or `TranslationsProvider`.

### 2. Rendering Strategy

- Prioritize server-side rendering over client-side rendering.
- DO NOT use server-only components in the storefront codebase.

### 3. Package Usage

- DO NOT use packages that are not installed in the project through package.json.

### 4. State Management

- DO NOT use React Context provider in the storefront.

### 5. Component Architecture

- DO NOT use client-side hooks or functions on the server side.
- Use Next.js specific best practices for an ecommerce storefront where speed is of the essence.

### 6. Concepts

- Country code and region are different concepts:
  - A region may contain multiple countries.
  - Tax prices are determined by country code when passed in the products API.
  - Example:
    ```
    Region: North America
    Country code: us
    ```
