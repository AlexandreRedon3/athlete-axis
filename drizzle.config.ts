import "dotenv/config";
import  { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/db/*",
  out: "./src/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
}); 