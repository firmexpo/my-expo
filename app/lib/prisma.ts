import { PrismaClient } from "@prisma/client";

declare global {
  // Reuse the client across hot reloads in development so we don't open a
  // new pool of MySQL connections on every file change.
  var _firmExpoPrisma: PrismaClient | undefined;
}

export const prisma = global._firmExpoPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global._firmExpoPrisma = prisma;
}
