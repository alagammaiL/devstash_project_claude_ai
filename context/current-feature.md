# Feature

Dashboard items backed by Neon PostgreSQL and Prisma, following `context/features/dashboard-items-spec.md`.

## Status

<!-- Not started |in progress |completed-->

completed

## Goals

- Replace dummy pinned and recent item data in the dashboard's main area with data fetched from Neon through Prisma.
- Create `src/lib/db/items.ts` with database item-fetching functions and call them directly from a Server Component.
- Preserve the existing item-card layout and styling, deriving item-card icons and borders from each item's type.
- Display item type tags and the existing item-card details.
- Update collection statistics with database-backed item results.
- Hide the pinned-items section entirely when there are no pinned items.

## Notes

- Preserve the current dashboard layout and styling; refer to `context/screenshots/dashboard-ui-main.png` if needed.
- Follow `context/features/dashboard-items-spec.md` for the feature requirements.
- Replace mock pinned and recent items in the dashboard's main area with Prisma-backed database items.
- When no items are pinned, do not render the pinned-items section.
- The `Collection.isFavorite` migration was applied to the development Neon database only; production was not migrated.
- The dashboard's collection cards, item cards, and dashboard item totals are database-backed; sidebar navigation and item-type counts remain mock-backed.
- Dashboard rendering is dynamic so collection data is queried at request time rather than frozen during the production build.

## History

<!--Keep this updated earliest to latest-->

- 2026-11-18: Initialized the Next.js project with the App Router, TypeScript, Tailwind CSS, and npm. Set up the initial `devstash` app.
- 2026-11-18: Started Dashboard UI Phase 1 according to `context/features/dashboard-phase-1-spec.md`.
- 2026-11-18: Completed Dashboard UI Phase 1 with shadcn/ui setup, the `/dashboard` route, dark styling, and display-only top bar and placeholders.
- 2026-11-18: Added the DevStash DS brand mark with a green-to-blue gradient and display-only Add Item and Add Feature buttons above the sidebar/main split.
- 2026-11-18: Started Dashboard UI Phase 2 according to `context/features/dashboard-phase-2-spec.md`.
- 2026-11-18: Completed Dashboard UI Phase 2 with item-type navigation, a collapsible Favorites section, recent collections, a collapsible desktop sidebar, a mobile drawer, and the user avatar area.
- 2026-11-18: Started Dashboard UI Phase 3 according to `context/features/dashboard-phase-3-spec.md`.
- 2026-11-18: Completed Dashboard UI Phase 3 with dashboard statistics, collection cards, pinned items, and 10 recent mock items.
- 2026-11-25: Started the Prisma 7 and Neon PostgreSQL development database feature using `context/features/database-spec.md` and `context/project-overview.md`.
- 2026-11-25: Implemented Prisma 7.10 configuration, Neon adapter, schema, typed client singleton, migration workflow, and idempotent system item-type seed.
- 2026-11-25: Completed the development database setup: applied the initial migration, generated Prisma Client, seeded system item types, verified migration status, and tested the database connection.
- 2026-11-25: Started the development demo data seed feature according to `context/features/seed-spec.md`.
- 2026-11-25: Implemented the demo user, bcrypt password hashing, seven specified item types, five collections, and 18 tagged sample items with stable IDs and idempotent upserts.
- 2026-11-25: Applied the password-hash migration to development and successfully ran the seed script.
- 2026-11-25: Expanded the database test script to fetch and validate the demo account, system item types, collections, sample items, HTTPS links, and ownership relations.
- 2026-11-25: Completed the development demo data feature with idempotent seed data and read-only database verification.
- 2026-11-25: Started the dashboard collections database integration according to `context/features/dashboard-collections-spec.md`.
- 2026-11-25: Added persisted collection favorites and fetched database collections, content-type summaries, and favorite counts for the dashboard's main area.
- 2026-11-25: Applied the `Collection.isFavorite` migration to development, regenerated Prisma Client, and reran the seed and database checks.
- 2026-11-25: Completed the dashboard collections integration; database checks, lint, type-check, production build, and the live dashboard request all passed.
- 2026-11-25: Started the dashboard items database integration according to `context/features/dashboard-items-spec.md`.
- 2026-11-25: Replaced mock pinned and recent dashboard items with Prisma-backed records, including database item types, tags, favorites, and update times; the pinned section now stays hidden when empty.
- 2026-11-25: Updated dashboard item and collection statistics to use database results; lint, type-check, production build, and development database checks passed.
