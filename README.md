# 🎒 BugOut Manager

A **PWA offline-first** app for managing emergency bugout bags — track gear, monitor weight, and stay prepared.

![BugOut Manager](public/pwa-512x512.png)

## Features

- **Multi-bag management** — Create and organize multiple bugout bags with weight limits
- **10 item categories** — Food & Water, Hygiene, Clothing, Medicine, Equipment, Lighting, Tactical, Notes & Documents, Accessories, Other
- **Weight tracking** — Real-time weight monitoring with visual warnings at 80% and 100% capacity (bag structure weight included)
- **Expiry tracking** — Track item expiration dates with automatic alerts for items expiring within 30 days
- **Checklist system** — Mark items as "In bag" ✅ or "To add" ⬜ (only checked items count toward weight)
- **Bulk import** — Add multiple items at once via text list
- **Move items** — Transfer items between bags
- **Backup & Restore** — Export/import all data as validated JSON with Zod schema
- **Bilingual** — Full English and Italian support
- **Weight units** — Switch between kg and lbs
- **Dark/Light theme** — Toggle with system preference support
- **Installable PWA** — Install as a native-like app on Android and iOS with install prompt
- **Persistent storage** — Requests browser storage persistence to protect data

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** — Design system with semantic tokens
- **IndexedDB** (via `idb`) — Offline-first local database
- **TanStack Query** — Async state management for IndexedDB operations
- **Zod** — Runtime validation for import/export data
- **vite-plugin-pwa** — Service worker, manifest, and offline support
- **date-fns** — Date formatting and expiry calculations

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # UI components (dialogs, cards, menus)
├── hooks/            # Custom hooks (bags, items, theme, language, weight unit, PWA)
├── lib/              # Types, DB layer, export/import logic, utils
├── pages/            # Route pages (Index, BagDetail, NotFound)
└── index.css         # Design tokens and global styles
```

## Data Model

| Entity | Storage | Key Fields |
|--------|---------|------------|
| **Bag** | IndexedDB `bags` store | id, name, description, weightLimit, bagWeight |
| **Item** | IndexedDB `items` store (indexed by `bagId`) | id, bagId, name, category, weight, quantity, expiryDate, checked |

All weights are stored internally in **grams** and converted for display based on the user's unit preference.

## PWA & Offline

The app works fully offline after the first visit. Data is stored in IndexedDB with persistent storage requested to prevent browser eviction. The service worker caches all assets for offline access.

## License

MIT
