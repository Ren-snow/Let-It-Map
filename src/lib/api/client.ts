import { hc } from "hono/client";
import type { AppType } from "@/server/api";

/**
 * Typed client for our own API. The request and response shapes come from the
 * route definitions, so a path or payload mistake fails at compile time.
 */
export const api = hc<AppType>("/");
