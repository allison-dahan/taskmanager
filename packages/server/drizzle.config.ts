import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:fAuRiMZE90xN@ep-soft-feather-a6l1kn68.us-west-2.aws.neon.tech/neondb?sslmode=require',
  },
  verbose: true,
  strict: true,
  out: "./src/db/migrations",
});