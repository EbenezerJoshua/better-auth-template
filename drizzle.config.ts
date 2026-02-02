import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/db/migrations', // where the migration files should be created
  schema: './src/db/schema.ts', // path to your schema file
  dialect: 'postgresql', // database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!, // database connection URL from environment variable -  Which database should I get connected to?
  },
});
