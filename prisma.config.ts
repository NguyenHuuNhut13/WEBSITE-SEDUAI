import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local for Next.js convention
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: env("DATABASE_URL"),
  },

  migrations: {
    seed: "npx tsx ./prisma/seed.ts",
  },
});
