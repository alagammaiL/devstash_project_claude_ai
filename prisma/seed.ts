import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: [".env.local", ".env"] });

const PASSWORD_HASH_ROUNDS = 12;
const DEMO_EMAIL = "demo@devstash.io";
const DEMO_PASSWORD = "12345678";

const systemItemTypes = [
  { id: "snippet", name: "snippet", icon: "Code", color: "#3b82f6" },
  { id: "prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { id: "command", name: "command", icon: "Terminal", color: "#f97316" },
  { id: "note", name: "note", icon: "StickyNote", color: "#fde047" },
  { id: "file", name: "file", icon: "File", color: "#6b7280" },
  { id: "image", name: "image", icon: "Image", color: "#ec4899" },
  { id: "link", name: "link", icon: "Link", color: "#10b981" },
] as const;

const collections = [
  {
    id: "react-patterns",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
  },
  {
    id: "ai-workflows",
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: false,
  },
  {
    id: "devops",
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    isFavorite: false,
  },
  {
    id: "terminal-commands",
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    isFavorite: true,
  },
  {
    id: "design-resources",
    name: "Design Resources",
    description: "UI/UX resources and references",
    isFavorite: false,
  },
] as const;

type CollectionId = (typeof collections)[number]["id"];
type ItemTypeId = (typeof systemItemTypes)[number]["id"];

interface SeedItem {
  id: string;
  title: string;
  description: string;
  content: string | null;
  url: string | null;
  language: string | null;
  typeId: ItemTypeId;
  collectionId: CollectionId;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
}

const items: SeedItem[] = [
  {
    id: "react-use-debounce",
    title: "Typed useDebounce Hook",
    description: "Delay updates to a value until input has settled.",
    content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
    url: null,
    language: "typescript",
    typeId: "snippet",
    collectionId: "react-patterns",
    tags: ["react", "hooks", "typescript"],
    isFavorite: true,
    isPinned: true,
  },
  {
    id: "react-use-local-storage",
    title: "Typed localStorage Hook",
    description: "Synchronize a typed value with browser localStorage.",
    content: `import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
    url: null,
    language: "typescript",
    typeId: "snippet",
    collectionId: "react-patterns",
    tags: ["react", "hooks", "browser"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "react-compound-components",
    title: "Compound Component Pattern",
    description: "Share state between related components through context.",
    content: `const TabsContext = createContext<TabsContextValue | null>(null);

function Tabs({ children }: PropsWithChildren) {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}`,
    url: null,
    language: "typescript",
    typeId: "snippet",
    collectionId: "react-patterns",
    tags: ["react", "components", "patterns"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "ai-code-review",
    title: "Code Review Prompt",
    description: "Review a change for correctness and maintainability.",
    content:
      "Review the supplied diff. Identify correctness bugs, security risks, missing edge cases, and maintainability issues. Prioritize actionable findings and cite the affected code. If there are no findings, say so and mention any remaining test gaps.",
    url: null,
    language: null,
    typeId: "prompt",
    collectionId: "ai-workflows",
    tags: ["ai", "code-review", "quality"],
    isFavorite: true,
    isPinned: false,
  },
  {
    id: "ai-documentation",
    title: "Documentation Generator",
    description: "Create concise documentation from an implementation.",
    content:
      "Explain the purpose, inputs, outputs, and important behavior of the supplied code. Include a short usage example and note errors or assumptions. Do not invent behavior that is not present in the implementation.",
    url: null,
    language: null,
    typeId: "prompt",
    collectionId: "ai-workflows",
    tags: ["ai", "documentation"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "ai-refactor-assistance",
    title: "Refactoring Assistant",
    description: "Plan a small refactor while preserving behavior.",
    content:
      "Inspect the supplied code and propose the smallest refactor that improves clarity or reduces duplication without changing behavior. Describe the affected files, call out risks, and include focused tests for the changed behavior.",
    url: null,
    language: null,
    typeId: "prompt",
    collectionId: "ai-workflows",
    tags: ["ai", "refactoring"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "devops-docker-compose",
    title: "Docker Compose App and Database",
    description: "Start an app and PostgreSQL service for local development.",
    content: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local-dev-only`,
    url: null,
    language: "yaml",
    typeId: "snippet",
    collectionId: "devops",
    tags: ["docker", "containers"],
    isFavorite: false,
    isPinned: true,
  },
  {
    id: "devops-deploy-command",
    title: "Build and Start Production App",
    description: "Build the Next.js app and start its production server.",
    content: "npm run build && npm run start",
    url: null,
    language: null,
    typeId: "command",
    collectionId: "devops",
    tags: ["deployment", "nextjs"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "devops-docker-docs",
    title: "Docker Documentation",
    description: "Official Docker documentation and Compose guides.",
    content: null,
    url: "https://docs.docker.com/compose/",
    language: null,
    typeId: "link",
    collectionId: "devops",
    tags: ["docker", "documentation"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "devops-github-actions",
    title: "GitHub Actions Documentation",
    description: "Official guides to GitHub Actions workflows.",
    content: null,
    url: "https://docs.github.com/en/actions",
    language: null,
    typeId: "link",
    collectionId: "devops",
    tags: ["ci-cd", "github", "documentation"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "terminal-git-summary",
    title: "Summarize Recent Git Changes",
    description: "Check the worktree and review the latest commits.",
    content: "git status --short && git log --oneline -5",
    url: null,
    language: null,
    typeId: "command",
    collectionId: "terminal-commands",
    tags: ["git", "workflow"],
    isFavorite: true,
    isPinned: false,
  },
  {
    id: "terminal-docker-containers",
    title: "List Running Docker Containers",
    description: "Show container names, status, and published ports.",
    content: 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"',
    url: null,
    language: null,
    typeId: "command",
    collectionId: "terminal-commands",
    tags: ["docker", "containers"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "terminal-top-processes",
    title: "Find Busy Node Processes",
    description: "List Node processes ordered by CPU use in PowerShell.",
    content:
      "Get-Process node | Sort-Object CPU -Descending | Select-Object -First 5",
    url: null,
    language: null,
    typeId: "command",
    collectionId: "terminal-commands",
    tags: ["powershell", "processes"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "terminal-npm-outdated",
    title: "Check Outdated npm Packages",
    description: "Show dependencies with newer versions available.",
    content: "npm outdated",
    url: null,
    language: null,
    typeId: "command",
    collectionId: "terminal-commands",
    tags: ["npm", "dependencies"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "design-tailwind-docs",
    title: "Tailwind CSS Documentation",
    description: "Utility-first CSS framework documentation.",
    content: null,
    url: "https://tailwindcss.com/docs",
    language: null,
    typeId: "link",
    collectionId: "design-resources",
    tags: ["css", "tailwind"],
    isFavorite: true,
    isPinned: false,
  },
  {
    id: "design-shadcn",
    title: "shadcn/ui Components",
    description: "Accessible, composable components built with Radix UI.",
    content: null,
    url: "https://ui.shadcn.com/",
    language: null,
    typeId: "link",
    collectionId: "design-resources",
    tags: ["components", "shadcn"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "design-material",
    title: "Material Design Guidelines",
    description: "Google's design system and interface guidelines.",
    content: null,
    url: "https://m3.material.io/",
    language: null,
    typeId: "link",
    collectionId: "design-resources",
    tags: ["design-system", "guidelines"],
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "design-lucide",
    title: "Lucide Icons",
    description: "Open-source icon library and icon search.",
    content: null,
    url: "https://lucide.dev/",
    language: null,
    typeId: "link",
    collectionId: "design-resources",
    tags: ["icons", "lucide"],
    isFavorite: false,
    isPinned: false,
  },
];

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo data seeding is disabled in production.");
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set before seeding the database.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  try {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, PASSWORD_HASH_ROUNDS);
    const user = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: {
        name: "Demo User",
        passwordHash,
        emailVerified: new Date(),
        isPro: false,
      },
      create: {
        email: DEMO_EMAIL,
        name: "Demo User",
        passwordHash,
        emailVerified: new Date(),
        isPro: false,
      },
    });

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

    for (const collection of collections) {
      await prisma.collection.upsert({
        where: { id: collection.id },
        update: {
          name: collection.name,
          description: collection.description,
          isFavorite: collection.isFavorite,
          userId: user.id,
        },
        create: { ...collection, userId: user.id },
      });
    }

    const tagNames = [...new Set(items.flatMap((item) => item.tags))];
    const tagIds = new Map<string, string>();

    for (const name of tagNames) {
      const tag = await prisma.tag.upsert({
        where: { userId_name: { userId: user.id, name } },
        update: {},
        create: { name, userId: user.id },
      });
      tagIds.set(name, tag.id);
    }

    const itemIds = items.map((item) => item.id);
    await prisma.itemCollection.deleteMany({
      where: { itemId: { in: itemIds } },
    });
    await prisma.itemTag.deleteMany({
      where: { itemId: { in: itemIds } },
    });

    for (const item of items) {
      const itemData = {
        title: item.title,
        description: item.description,
        content: item.content,
        url: item.url,
        language: item.language,
        typeId: item.typeId,
        isFavorite: item.isFavorite,
        isPinned: item.isPinned,
      };

      await prisma.item.upsert({
        where: { id: item.id },
        update: { ...itemData, userId: user.id },
        create: { ...itemData, id: item.id, userId: user.id },
      });
    }

    await prisma.itemCollection.createMany({
      data: items.map((item) => ({
        itemId: item.id,
        collectionId: item.collectionId,
      })),
    });
    await prisma.itemTag.createMany({
      data: items.flatMap((item) =>
        item.tags.map((name) => {
          const tagId = tagIds.get(name);
          if (!tagId) {
            throw new Error(`Missing seeded tag "${name}".`);
          }
          return { itemId: item.id, tagId };
        }),
      ),
    });

    console.log(
      `Seeded demo user, ${systemItemTypes.length} item types, ${collections.length} collections, and ${items.length} items.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Failed to seed development demo data:", error);
  process.exitCode = 1;
});
