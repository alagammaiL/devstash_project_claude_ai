# Current Feature: Add Pro Side Badge

## Status

Complete

## Goals

- Add a reusable shadcn/ui Pro badge component for the sidebar.
- Display the badge next to the Files and Images item names.
- Make the badge responsive across screen sizes.
- Show a "Pro Feature" tooltip on hover.
- Keep the badge clean and visually distinct.

## Notes

- Loaded from `context/features/pro-side-badge-spec.md`.
- The badge indicates access to pro features for File and Image item types.
- Placement: next to the item name in the sidebar.

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
- 2026-11-25: Started the dashboard stats and sidebar integration according to `context/features/stats-sidebar-spec.md`.
- 2026-11-25: Connected sidebar item types, counts, and collections to Prisma; added the View all collections link and dominant-type color indicators for recent collections.
- 2026-11-25: Updated dashboard statistics to use full database counts while preserving the six-card layout; lint, type-check, production build, and 36 development database checks passed.
- 2026-11-28: Started the Pro side badge feature according to `context/features/pro-side-badge-spec.md`.
- 2026-11-28: Completed the Pro side badge feature with reusable shadcn badge and tooltip components for the Files and Images sidebar item types.
