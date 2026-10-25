import { Hono } from "hono";
import { toResponse } from "./errors";
import { posts } from "@/server/post/routes";

/** Chained so the route types survive into AppType for the typed client. */
const app = new Hono().basePath("/api").route("/posts", posts);

app.onError(toResponse);

/** Consumed by src/lib/api/client.ts. Types only — no server code ships. */
export type AppType = typeof app;

export { app };
