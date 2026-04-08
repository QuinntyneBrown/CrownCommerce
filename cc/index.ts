#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

const commands: Record<string, string> = {
  health: "Environment health checks",
  seed: "Database seeding (idempotent)",
  migrate: "Database migration management",
  deploy: "Deployment orchestration",
  scaffold: "Code generation",
};

function printHelp() {
  console.log("\n  CrownCommerce CLI (cc)\n");
  console.log("  Usage: cc <command> [options]\n");
  console.log("  Commands:");
  for (const [cmd, desc] of Object.entries(commands)) {
    console.log(`    ${cmd.padEnd(15)} ${desc}`);
  }
  console.log("");
}

async function main(): Promise<number> {
  if (!command || command === "help" || command === "--help") {
    printHelp();
    return 0;
  }

  if (command === "health") {
    const { health } = await import("./commands/health");
    return health();
  }

  if (command === "seed") {
    const { seed } = await import("./commands/seed");
    return seed();
  }

  if (command === "migrate") {
    const { migrate } = await import("./commands/migrate");
    return migrate(commandArgs);
  }

  if (commands[command]) {
    console.log(`\n  Command '${command}' is not yet implemented.\n`);
    return 0;
  }

  console.error(`\n  Unknown command: ${command}\n`);
  printHelp();
  return 1;
}

void main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
