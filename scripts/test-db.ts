import dotenv from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: [".env.local", ".env"] });

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to test the database connection.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  try {
    const [connection] = await prisma.$queryRaw<
      Array<{ database: string; schema: string }>
    >`SELECT current_database()::text AS database, current_schema()::text AS schema`;

    if (!connection) {
      throw new Error("The database connection test returned no result.");
    }

    console.log(
      `Database connection successful: ${connection.database} (${connection.schema} schema).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Database connection test failed:", error);
  process.exitCode = 1;
});
