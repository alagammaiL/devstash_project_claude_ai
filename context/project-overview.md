# DevStash — Project Overview

> One fast, searchable hub for all developer knowledge: snippets, prompts, commands, notes, files, images and links.

_Assumption: DevStash is a personal/team "stash" app for developers. Adjust any section that doesn't match your idea._

---

## 1. Problem & Goal

Developers keep useful things scattered across VS Code, Notion, GitHub Gists, bookmarks, terminal history and random folders. DevStash puts everything in one place with search, tags and collections.

**MVP goal:** create, view, search, tag and organise items of 7 types, with login.

---

## 2. Tech Stack

| Layer            | Choice                                  | Why                               |
| ---------------- | --------------------------------------- | --------------------------------- |
| Framework        | Next.js (App Router) + TypeScript       | Frontend + API routes in one repo |
| Styling          | Tailwind CSS + shadcn/ui                | Fast, consistent UI               |
| Icons            | lucide-react                            | Matches shadcn/ui                 |
| Database         | PostgreSQL (Neon)                       | Free tier, serverless             |
| ORM              | Prisma                                  | Typed queries, easy migrations    |
| Auth             | NextAuth (Auth.js) v5                   | Email + GitHub login              |
| File storage     | Cloudflare R2 / UploadThing             | For File and Image items          |
| Search           | Postgres full-text (later: Meilisearch) | Start simple                      |
| Editor           | Monaco / CodeMirror + react-markdown    | Snippets and notes                |
| Validation       | Zod                                     | Shared client/server schemas      |
| Payments (later) | Stripe                                  | Free vs Pro plans                 |
| Hosting          | Vercel                                  | Zero-config for Next.js           |

---

## 3. Item Types & Icons

All icons are from **lucide-react**.

| Type    | Icon (Lucide) | Colour           | Content kind           | Example                   |
| ------- | ------------- | ---------------- | ---------------------- | ------------------------- |
| Snippet | `Code`        | `#3b82f6` blue   | text (code + language) | A debounce hook           |
| Prompt  | `Sparkles`    | `#f59e0b` amber  | text                   | Code-review prompt for AI |
| Command | `Terminal`    | `#22c55e` green  | text                   | `git rebase -i HEAD~5`    |
| Note    | `StickyNote`  | `#eab308` yellow | text (markdown)        | Architecture decisions    |
| File    | `File`        | `#64748b` slate  | file upload            | Config PDF                |
| Image   | `Image`       | `#ec4899` pink   | file upload            | Design screenshot         |
| Link    | `Link`        | `#06b6d4` cyan   | URL                    | Docs bookmark             |

Other UI icons: `Search`, `Plus`, `Star` (favourite), `Pin`, `FolderOpen` (collections), `Tag`, `Settings`, `LogOut`, `Copy`, `Trash2`, `Pencil`.

---

## 4. Data Model

### User

| Field     | Type          | Notes         |
| --------- | ------------- | ------------- |
| id        | String (cuid) | PK            |
| name      | String?       |               |
| email     | String        | unique        |
| image     | String?       | avatar        |
| isPro     | Boolean       | default false |
| createdAt | DateTime      |               |

### Item

| Field                 | Type          | Notes                                |
| --------------------- | ------------- | ------------------------------------ |
| id                    | String (cuid) | PK                                   |
| title                 | String        | required                             |
| description           | String?       |                                      |
| content               | String?       | text for snippet/prompt/command/note |
| url                   | String?       | for Link                             |
| fileUrl               | String?       | for File/Image                       |
| language              | String?       | for Snippet                          |
| isFavorite            | Boolean       | default false                        |
| isPinned              | Boolean       | default false                        |
| typeId                | String        | FK → ItemType                        |
| userId                | String        | FK → User                            |
| createdAt / updatedAt | DateTime      |                                      |

### ItemType

| Field    | Type    | Notes              |
| -------- | ------- | ------------------ |
| id       | String  | PK                 |
| name     | String  | snippet, prompt, … |
| icon     | String  | Lucide icon name   |
| color    | String  | hex                |
| isSystem | Boolean | built-in types     |

### Collection

| Field       | Type    | Notes     |
| ----------- | ------- | --------- |
| id          | String  | PK        |
| name        | String  |           |
| description | String? |           |
| userId      | String  | FK → User |

### Tag

| Field | Type   | Notes           |
| ----- | ------ | --------------- |
| id    | String | PK              |
| name  | String | unique per user |

### Join tables

- `ItemCollection` (itemId, collectionId) — many-to-many
- `ItemTag` (itemId, tagId) — many-to-many

```
User 1─* Item *─1 ItemType
Item *─* Collection
Item *─* Tag
```

---

## 5. Folder Structure

```
devstash/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ (auth)/login/page.tsx
│  │  ├─ (dashboard)/
│  │  │  ├─ layout.tsx          # sidebar + topbar
│  │  │  ├─ page.tsx            # dashboard home
│  │  │  ├─ items/[type]/page.tsx
│  │  │  ├─ collections/page.tsx
│  │  │  └─ settings/page.tsx
│  │  ├─ api/
│  │  │  ├─ auth/[...nextauth]/route.ts
│  │  │  ├─ items/route.ts
│  │  │  ├─ collections/route.ts
│  │  │  └─ upload/route.ts
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ ui/                    # shadcn components
│  │  ├─ layout/                # Sidebar, Topbar
│  │  ├─ items/                 # ItemCard, ItemForm, ItemList
│  │  └─ collections/
│  ├─ lib/
│  │  ├─ prisma.ts              # Prisma client singleton
│  │  ├─ auth.ts                # NextAuth config
│  │  ├─ validations.ts         # Zod schemas
│  │  └─ utils.ts
│  ├─ actions/                  # Server actions (createItem, …)
│  ├─ data/mock.ts              # Mock data (Phase 1 only)
│  └─ types/index.ts
├─ .env.local
├─ project-overview.md
└─ package.json
```

---

## 6. Build Phases (when to install what)

### Phase 1 — Frontend only (mock data)

**Goal:** finished UI with no backend.

```bash
npx create-next-app@latest devstash --typescript --tailwind --eslint --app --src-dir
cd devstash
npx shadcn@latest init
npm install lucide-react
```

Build: layout, sidebar, dashboard, item cards, forms — all reading from `src/data/mock.ts`.

### Phase 2 — Database + backend ← _install backend here_

**Start this when the UI is stable and your mock data shape matches the model in section 4.**

```bash
npm install prisma --save-dev
npm install @prisma/client zod
npx prisma init
```

1. Create a free Neon Postgres project, copy the connection string.
2. Put it in `.env.local` as `DATABASE_URL`.
3. Write the schema in `prisma/schema.prisma`.
4. `npx prisma migrate dev --name init`
5. Add `prisma/seed.ts` (system item types + sample data), run `npx prisma db seed`.
6. Replace mock imports with Prisma queries in server components / server actions.

### Phase 3 — Authentication

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
```

Add `User/Account/Session` models, configure `src/lib/auth.ts`, protect `(dashboard)` routes with middleware, scope every query by `userId`.

### Phase 4 — Search, tags, collections

Postgres full-text search, tag filtering, favourites/pins.

### Phase 5 — File & image uploads

```bash
npm install uploadthing @uploadthing/react
```

(or Cloudflare R2 with the AWS S3 SDK).

### Phase 6 — Pro features & polish

Stripe subscriptions, export, AI tagging/summaries, keyboard shortcuts, dark mode.

---

## 7. How to Connect Frontend ↔ Backend

Next.js lets you skip a separate API server:

| Need                                | Use                                      |
| ----------------------------------- | ---------------------------------------- |
| Read data for a page                | Server Component calls Prisma directly   |
| Create / update / delete            | **Server Actions** in `src/actions/`     |
| Uploads, webhooks, external clients | Route Handlers in `src/app/api/`         |
| Client-side interactivity           | Client components calling server actions |

**Prisma client singleton** (`src/lib/prisma.ts`):

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Server Component read:**

```ts
const items = await prisma.item.findMany({
  where: { userId: session.user.id },
  include: { type: true, tags: true },
  orderBy: { createdAt: "desc" },
});
```

**Server Action write:**

```ts
"use server";
export async function createItem(data: unknown) {
  const parsed = itemSchema.parse(data); // Zod
  await prisma.item.create({ data: { ...parsed, userId } });
  revalidatePath("/");
}
```

---

## 8. Environment Variables

| Variable                                      | Used for      | Phase |
| --------------------------------------------- | ------------- | ----- |
| `DATABASE_URL`                                | Neon Postgres | 2     |
| `AUTH_SECRET`                                 | NextAuth      | 3     |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`       | GitHub login  | 3     |
| `UPLOADTHING_TOKEN`                           | File uploads  | 5     |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Payments      | 6     |

Never commit `.env.local`.

---

## 9. Plans

| Feature            | Free  | Pro       |
| ------------------ | ----- | --------- |
| Items              | 50    | Unlimited |
| Collections        | 3     | Unlimited |
| File / Image items | ✗     | ✓         |
| Search             | Basic | Full-text |
| Export             | ✗     | ✓         |
| AI features        | ✗     | ✓         |

---

## 10. Dashboard Layout

| Area    | Content                                          |
| ------- | ------------------------------------------------ |
| Sidebar | Item types (with icons), Collections, Favourites |
| Topbar  | Search, "New Item" button, user menu             |
| Main    | Stats cards, pinned items, recent items grid     |

---

## 11. Coding Rules

- TypeScript strict mode, no `any`.
- Validate all input with Zod on the server.
- Every DB query filters by `userId`.
- Server Components by default; add `"use client"` only when needed.
- Keep components small; one responsibility each.
- Commit after each working feature.

## screenshots

Refer the screen shots for design the dashboard UI not exactly take it as a reference
@context/screenshots/dashboard-ui-drawer.png
@context/screenshots/dashboard-ui-main.png
