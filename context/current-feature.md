# Feature

Development demo data seeding based on `context/features/seed-spec.md`.

## Status

<!-- Not started |in progress |completed-->

completed

## Goals

- Upsert the demo user and hash the development password with bcryptjs using 12 rounds.
- Seed the seven system item types with the icons and colors in `context/features/seed-spec.md`.
- Seed the five specified collections and their sample snippets, prompts, commands, links, tags, and relations.
- Add a read-only check that fetches and verifies the database connection, demo user, item types, collections, sample items, URLs, tags, and relations.
- Keep seeding repeatable and prevent demo data from being seeded in production.

## Notes

- The demo user's password is stored as a bcrypt hash using 12 rounds.
- Seeding is idempotent and blocked when `NODE_ENV` is `production`.
- The password-hash migration is applied to the development database and the seed has run successfully.
- `scripts/test-db.ts` verifies the stored seed data and its relationships without modifying the database.
- Follow `context/features/seed-spec.md` for the complete seed data requirements.

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
