import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: [".env.local", ".env"] });

const demoEmail = "demo@devstash.io";
const demoPassword = "12345678";

const expectedItemTypes = [
  { id: "snippet", name: "snippet", icon: "Code", color: "#3b82f6" },
  { id: "prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { id: "command", name: "command", icon: "Terminal", color: "#f97316" },
  { id: "note", name: "note", icon: "StickyNote", color: "#fde047" },
  { id: "file", name: "file", icon: "File", color: "#6b7280" },
  { id: "image", name: "image", icon: "Image", color: "#ec4899" },
  { id: "link", name: "link", icon: "Link", color: "#10b981" },
];

interface ExpectedCollection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  typeCounts: Record<string, number>;
}

const expectedCollections: ExpectedCollection[] = [
  {
    id: "react-patterns",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    itemCount: 3,
    typeCounts: { snippet: 3 },
  },
  {
    id: "ai-workflows",
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    itemCount: 3,
    typeCounts: { prompt: 3 },
  },
  {
    id: "devops",
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    itemCount: 4,
    typeCounts: { snippet: 1, command: 1, link: 2 },
  },
  {
    id: "terminal-commands",
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    itemCount: 4,
    typeCounts: { command: 4 },
  },
  {
    id: "design-resources",
    name: "Design Resources",
    description: "UI/UX resources and references",
    itemCount: 4,
    typeCounts: { link: 4 },
  },
];

function isHttpsUrl(value: string | null): boolean {
  if (!value) {
    return false;
  }

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to test the database.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  try {
    const checks: string[] = [];
    const check = (condition: boolean, description: string) => {
      if (!condition) {
        throw new Error(`Database check failed: ${description}`);
      }
      checks.push(description);
    };

    const [connection] = await prisma.$queryRaw<
      Array<{ database: string; schema: string }>
    >`SELECT current_database()::text AS database, current_schema()::text AS schema`;

    if (!connection) {
      throw new Error("Database query returned no connection information.");
    }

    const user = await prisma.user.findUnique({
      where: { email: demoEmail },
      select: {
        id: true,
        name: true,
        emailVerified: true,
        isPro: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new Error(`Seeded demo user "${demoEmail}" was not found.`);
    }

    check(user.name === "Demo User", "demo user name");
    check(user.isPro === false, "demo user is on the free plan");
    check(user.emailVerified !== null, "demo user email is verified");

    const passwordHash = user.passwordHash;
    if (!passwordHash) {
      throw new Error("Demo user password hash was not found.");
    }
    check(/^\$2[aby]\$12\$/.test(passwordHash), "bcrypt hash uses 12 rounds");
    check(
      await bcrypt.compare(demoPassword, passwordHash),
      "demo password matches its bcrypt hash",
    );

    const itemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      select: { id: true, name: true, icon: true, color: true },
    });

    check(
      itemTypes.length === expectedItemTypes.length,
      "seven system item types exist",
    );
    for (const expected of expectedItemTypes) {
      const actual = itemTypes.find((itemType) => itemType.id === expected.id);
      check(
        actual !== undefined &&
          actual.name === expected.name &&
          actual.icon === expected.icon &&
          actual.color === expected.color,
        `${expected.id} item type icon and color`,
      );
    }

    const collections = await prisma.collection.findMany({
      where: {
        userId: user.id,
        id: { in: expectedCollections.map((collection) => collection.id) },
      },
      select: { id: true, name: true, description: true },
    });

    check(
      collections.length === expectedCollections.length,
      "all five seeded collections exist",
    );
    for (const expected of expectedCollections) {
      const actual = collections.find((collection) => collection.id === expected.id);
      check(
        actual !== undefined &&
          actual.name === expected.name &&
          actual.description === expected.description,
        `${expected.name} collection details`,
      );
    }

    const items = await prisma.item.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        url: true,
        language: true,
        typeId: true,
        type: { select: { id: true, name: true } },
        collections: {
          select: {
            collection: { select: { id: true, userId: true } },
          },
        },
        tags: {
          select: {
            tag: { select: { name: true, userId: true } },
          },
        },
      },
    });

    check(items.length === 18, "all 18 sample items exist");
    check(
      items.every(
        (item) =>
          item.title.trim().length > 0 &&
          Boolean(item.description?.trim()) &&
          item.type.id === item.typeId &&
          item.type.name === item.typeId,
      ),
      "sample items have titles, descriptions, and valid item types",
    );
    check(
      items.every(
        (item) =>
          item.collections.length === 1 &&
          item.collections.every(
            ({ collection }) => collection.userId === user.id,
          ) &&
          item.tags.length > 0 &&
          item.tags.every(
            ({ tag }) => tag.userId === user.id && tag.name.trim().length > 0,
          ),
      ),
      "items have collection and tag relations owned by the demo user",
    );
    check(
      items
        .filter((item) => item.typeId !== "link")
        .every((item) => Boolean(item.content?.trim())),
      "snippets, prompts, and commands have content",
    );
    check(
      items
        .filter((item) => item.typeId === "snippet")
        .every((item) => Boolean(item.language?.trim())),
      "snippets declare a programming language",
    );

    for (const expected of expectedCollections) {
      const collectionItems = items.filter((item) =>
        item.collections.some(
          ({ collection }) => collection.id === expected.id,
        ),
      );

      check(
        collectionItems.length === expected.itemCount,
        `${expected.name} has ${expected.itemCount} items`,
      );
      check(
        collectionItems.every(
          (item) => expected.typeCounts[item.typeId] !== undefined,
        ) &&
          Object.entries(expected.typeCounts).every(
            ([typeId, count]) =>
              collectionItems.filter((item) => item.typeId === typeId).length ===
              count,
          ),
        `${expected.name} item types match the seed specification`,
      );

      if (expected.id === "react-patterns") {
        check(
          collectionItems.every((item) => item.language === "typescript"),
          "React Patterns snippets use TypeScript",
        );
      }
    }

    const links = items.filter((item) => item.typeId === "link");
    check(
      links.length === 6 && links.every((item) => isHttpsUrl(item.url)),
      "all six links have valid HTTPS URLs",
    );

    console.log(
      `Database checks passed (${checks.length}). Connected to ${connection.database} (${connection.schema} schema).`,
    );
    for (const description of checks) {
      console.log(`PASS ${description}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Database verification failed:", error);
  process.exitCode = 1;
});
