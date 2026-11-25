import dotenv from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: [".env.local", ".env"] });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set before seeding the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

const systemItemTypes = [
  { id: "snippet", name: "snippet", icon: "Code", color: "#3b82f6" },
  { id: "prompt", name: "prompt", icon: "Sparkles", color: "#f59e0b" },
  { id: "command", name: "command", icon: "Terminal", color: "#22c55e" },
  { id: "note", name: "note", icon: "StickyNote", color: "#eab308" },
  { id: "file", name: "file", icon: "File", color: "#64748b" },
  { id: "image", name: "image", icon: "Image", color: "#ec4899" },
  { id: "link", name: "link", icon: "Link", color: "#06b6d4" },
];

async function main() {
  for (const itemType of systemItemTypes) {
    await prisma.itemType.upsert({
      where: { name: itemType.name },
      update: {
        icon: itemType.icon,
        color: itemType.color,
        isSystem: true,
      },
      create: { ...itemType, isSystem: true },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error("Failed to seed system item types:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
