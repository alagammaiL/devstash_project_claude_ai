# DevStash

DevStash is a searchable hub for developer knowledge, built with Next.js, TypeScript, Prisma 7, and Neon PostgreSQL.

## Getting Started

Install dependencies and configure the database:

```bash
npm install
```

Create a development branch in Neon, copy `.env.example` to `.env` (or `.env.local`), and set:

- `DATABASE_URL` to the pooled connection string for the development branch.
- `DIRECT_URL` to the direct connection string for that same branch. Prisma uses this for migrations.

Generate Prisma Client, create/apply the initial migration, then seed the system item types:

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run db:test
```

Always use migrations for schema changes. Do not use `prisma db push` unless explicitly requested. For production, create a separate Neon branch and run `npm run db:deploy` with that branch's direct connection string.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
