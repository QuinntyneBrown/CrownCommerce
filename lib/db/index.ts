import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as catalog from "./schema/catalog";
import * as orders from "./schema/orders";
import * as identity from "./schema/identity";
import * as content from "./schema/content";
import * as newsletter from "./schema/newsletter";
import * as chat from "./schema/chat";
import * as inquiries from "./schema/inquiries";
import * as scheduling from "./schema/scheduling";
import * as crm from "./schema/crm";
import * as notifications from "./schema/notifications";

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/crown_commerce";

const client = postgres(connectionString);

export const db = drizzle(client, {
  schema: {
    ...catalog,
    ...orders,
    ...identity,
    ...content,
    ...newsletter,
    ...chat,
    ...inquiries,
    ...scheduling,
    ...crm,
    ...notifications,
  },
});

export type Database = typeof db;
