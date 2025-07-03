"use server";
import "dotenv/config";
import { Config } from "drizzle-kit";

export default {
  schema: "./src/db/*",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
} satisfies Config;