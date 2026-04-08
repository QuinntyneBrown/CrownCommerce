import { db } from "../../lib/db";
import { sql } from "drizzle-orm";

export async function health(): Promise<number> {
  console.log("\n  CrownCommerce Health Check\n");

  // Check database connectivity
  try {
    await db.execute(sql`SELECT 1`);
    console.log("  ✅ Database connection: OK");
  } catch (err) {
    console.error("  ❌ Database connection: FAILED", err instanceof Error ? err.message : "");
    return 1;
  }

  // Check required environment variables
  const requiredVars = ["DATABASE_URL"];
  const recommendedVars = ["AUTH_SECRET", "NEXT_PUBLIC_API_URL"];

  for (const v of requiredVars) {
    if (process.env[v]) {
      console.log(`  ✅ ${v}: set`);
    } else {
      console.error(`  ❌ ${v}: missing (required)`);
      return 1;
    }
  }

  for (const v of recommendedVars) {
    if (process.env[v]) {
      console.log(`  ✅ ${v}: set`);
    } else {
      console.log(`  ⚠️  ${v}: not set (recommended)`);
    }
  }

  console.log("\n  Environment is healthy.\n");
  return 0;
}
