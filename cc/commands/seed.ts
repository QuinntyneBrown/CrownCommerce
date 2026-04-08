export async function seed(): Promise<number> {
  console.log("\n  Running database seeders...\n");
  try {
    await import("../../lib/db/seed/index");
    return 0;
  } catch (err) {
    console.error("  ❌ Seeding failed:", err instanceof Error ? err.message : err);
    return 1;
  }
}
