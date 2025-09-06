#!/usr/bin/env ts-node

/**
 *
 * Usage:
 *   pnpm migrate:create "short_description"
 *
 * Creates a UTC-timestamped SQL migration file in migrations/supabase.
 */
import { promises as fs } from "fs";
import { join } from "path";

/**
 * Pad a number to two digits.
 */
function pad(number: number): string {
  return number.toString().padStart(2, "0");
}

/**
 * Generate UTC timestamp string YYYYMMDDHHmmss.
 */
function utcTimestamp(): string {
  const now = new Date();
  const YYYY = now.getUTCFullYear();
  const MM = pad(now.getUTCMonth() + 1);
  const DD = pad(now.getUTCDate());
  const HH = pad(now.getUTCHours());
  const mm = pad(now.getUTCMinutes());
  const ss = pad(now.getUTCSeconds());
  return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
}

/**
 * Slugify a description: lowercase, replace spaces and invalid chars with underscores.
 */
function slugify(desc: string): string {
  return desc
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_");
}

async function main() {
  const [, , rawDesc] = process.argv;

  if (!rawDesc) {
    console.error("Error: Migration description is required.");
    console.error('Usage: pnpm migrate:create "short_description"');
    process.exit(1);
  }

  const timestamp = utcTimestamp();
  const slug = slugify(rawDesc);
  const fileName = `${timestamp}_${slug}.up.sql`;
  const migrationsDir = join(process.cwd(), "migrations", "supabase");
  const filePath = join(migrationsDir, fileName);

  try {
    await fs.mkdir(migrationsDir, { recursive: true });
    await fs.writeFile(filePath, "-- Write your SQL migration here\n", {
      flag: "wx",
    });
    return filePath;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Failed to create migration file:", err.message);
    } else {
      console.error("Failed to create migration file:", err);
    }
    process.exit(1);
  }
}

main().then((filePath) => {
  console.log(`Created migration: ${filePath}`);
});
