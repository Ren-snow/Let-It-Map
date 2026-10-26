import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { revalidatePath } from "next/cache";
import { createPostInput, updatePostInput } from "@/server/schema/post";
import { authRequired, type AuthEnv } from "@/server/api/middleware/auth";
import * as postService from "./service";

/** "/" renders per request, but revalidate anyway so a cached map stays honest. */
function revalidatePost(id: string) {
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
}

// Chained as one expression: defining these as separate statements would still
// work at runtime but drop them from AppType, silently untyping the client.
// The validation hooks stay inline — Hono types them against each schema.
export const posts = new Hono<AuthEnv>()
  .post(
    "/",
    authRequired,
    zValidator("json", createPostInput, (result, c) => {
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }
    }),
    async (c) => {
      const post = await postService.create(c.get("userId"), c.req.valid("json"));
      revalidatePost(post.id);
      return c.json(post, 201);
    },
  )
  .put(
    "/:id",
    authRequired,
    zValidator("json", updatePostInput, (result, c) => {
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }
    }),
    async (c) => {
      const post = await postService.update(
        c.get("userId"),
        c.req.param("id"),
        c.req.valid("json"),
      );
      revalidatePost(post.id);
      return c.json(post);
    },
  )
  .delete("/:id", authRequired, async (c) => {
    const post = await postService.remove(c.get("userId"), c.req.param("id"));
    revalidatePost(post.id);
    return c.json(post);
  });
