# Codebase Structure

## Project Layout

```
/workspace/apps/
├── storefront/src/
│   ├── pages/           # Page components (home.tsx, product.tsx, cart.tsx)
│   ├── routes/          # TanStack Router routes (/$countryCode/...)
│   ├── components/      # navbar.tsx, footer.tsx, cart.tsx, layout.tsx
│   │   └── ui/          # Base components (button, input, drawer, select)
│   ├── lib/
│   │   ├── hooks/       # useCart, useCategories, useRegions, etc.
│   │   ├── data/        # Data fetching functions (products, regions, cart)
│   │   ├── context/     # CartProvider, cart drawer state
│   │   ├── utils/       # Helpers (getCountryCodeFromPath, etc.)
│   │   └── config.ts    # Medusa SDK client configuration
│   └── styles/          # theme.css, app.css
│
└── backend/             # Standard Medusa project
    └── src/admin/lib/client.ts  # Admin SDK client
```

## Storefront Key Files

| File | Purpose |
|------|---------|
| `pages/home.tsx` | Homepage with store link |
| `pages/product.tsx` | Two-column product detail (ImageGallery + ProductActions) |
| `components/navbar.tsx` | Sticky header, Radix NavigationMenu, mobile Drawer |
| `components/footer.tsx` | Branding, category links, country selector |
| `components/cart.tsx` | CartDropdown, CartLineItem, CartSummary, CartPromo |
| `components/layout.tsx` | App wrapper with ToastProvider, CartProvider |
| `styles/theme.css` | Font (Inter), animation keyframes |
| `styles/app.css` | Tailwind setup, `.content-container` utility |

## Data Fetching

- **Storefront SDK:** `storefront/src/lib/config.ts`
- **Admin SDK:** `backend/src/admin/lib/client.ts`
- **Data functions:** `storefront/src/lib/data/` - API calls (listProducts, getRegion, etc.)
- **Hooks:** `storefront/src/lib/hooks/` - React Query wrappers
- **SSR:** Route loaders fetch server-side, accessed via `useLoaderData()`

## Patterns

- **Routing:** TanStack Router with `/$countryCode/` prefix
- **Styling:** Tailwind + zinc color palette + custom animations in theme.css
- **UI:** Radix primitives (NavigationMenu, Drawer, Dialog)
