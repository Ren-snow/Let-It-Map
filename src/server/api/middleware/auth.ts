import { createMiddleware } from "hono/factory";
import { auth } from "@/lib/auth";

export type AuthEnv = { Variables: { userId: string } };

/**
 * Resolves the session and rejects anonymous callers, so a route handler can
 * take the user for granted. The domain layer never reads the session itself.
 */
export const authRequired = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return c.json({ error: "Authentication required" }, 401);
  }

  c.set("userId", userId);
  await next();
});
