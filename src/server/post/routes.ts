import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { revalidatePath } from "next/cache";
import * as postService from "./service";
import { createPostInput } from "@/server/schema/post";
import { authRequired, type AuthEnv } from "@/server/api/middleware/auth";

export const posts = new Hono<AuthEnv>().post(
  "/",
  authRequired,
  zValidator("json", createPostInput, (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error.issues[0].message }, 400);
    }
  }),
  async (c) => {
    const post = await postService.create(c.get("userId"), c.req.valid("json"));

    // The map at "/" is prerendered, so a new pin needs it invalidated too.
    revalidatePath("/");
    revalidatePath("/posts");

    return c.json(post, 201);
  },
);
