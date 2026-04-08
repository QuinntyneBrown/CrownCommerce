export async function migrate(args: string[]): Promise<number> {
  const subcommand = args[0] || "status";

  if (subcommand === "status") {
    console.log("\n  Migration status\n");
    console.log("  Run 'npx drizzle-kit generate' to create migration files.");
    console.log("  Run 'npx drizzle-kit migrate' to apply pending migrations.");
    console.log("  Run 'npx drizzle-kit push' for development-only schema sync.\n");
    console.log("  ⚠️  Do not use 'drizzle-kit push' in production. Use checked-in migration files.\n");
    return 0;
  }

  if (subcommand === "generate") {
    console.log("\n  Generating migration files...\n");
    const { execSync } = await import("child_process");
    try {
      execSync("npx drizzle-kit generate", { stdio: "inherit" });
      return 0;
    } catch {
      return 1;
    }
  }

  if (subcommand === "push") {
    if (process.env.NODE_ENV === "production") {
      console.error("  ❌ 'cc migrate push' is not allowed in production. Use checked-in migrations.");
      return 1;
    }
    console.log("\n  Pushing schema to development database...\n");
    const { execSync } = await import("child_process");
    try {
      execSync("npx drizzle-kit push", { stdio: "inherit" });
      return 0;
    } catch {
      return 1;
    }
  }

  console.error(`  Unknown migrate subcommand: ${subcommand}`);
  console.log("  Available: status, generate, push\n");
  return 1;
}
