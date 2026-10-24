import type { Context } from "hono";
import { ForbiddenError, NotFoundError } from "@/server/errors";

/**
 * The single place that maps domain errors onto HTTP. Services throw plain
 * domain errors and stay unaware that an HTTP layer exists at all.
 */
export function toResponse(error: Error, c: Context) {
  if (error instanceof NotFoundError) {
    return c.json({ error: error.message }, 404);
  }
  if (error instanceof ForbiddenError) {
    return c.json({ error: error.message }, 403);
  }

  console.error(error);
  return c.json({ error: "Internal server error" }, 500);
}
