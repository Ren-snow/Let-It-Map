import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // DDL must go through the direct/session connection (port 5432).
    // Supabase's transaction pooler (port 6543) rejects schema changes,
    // so DATABASE_URL is only used by the app at runtime.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});
