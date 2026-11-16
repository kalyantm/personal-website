import { PrismaClient } from "@prisma/client";

declare global {
  var __db__: PrismaClient | undefined;
}

let client: PrismaClient | undefined;

/**
 * The Prisma client is created on first use, not when this module loads. Every page imports
 * this through the session code, but only signed-in sessions ever query the database, so a
 * missing or failed `prisma generate` (e.g. an unsupported build image) no longer takes down
 * every page.
 */
function getClient(): PrismaClient {
  if (client) return client;
  if (process.env.NODE_ENV === "production") {
    client = new PrismaClient();
  } else {
    // In development, reuse one client across live reloads instead of opening a new connection each time.
    global.__db__ ??= new PrismaClient();
    client = global.__db__;
    client.$connect();
  }
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const c = getClient();
    const value = Reflect.get(c, prop, c);
    return typeof value === "function" ? value.bind(c) : value;
  },
});
