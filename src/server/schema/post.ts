import { z } from "zod";
import { locationInput } from "@/server/schema/location";

const title = z.string().min(1).max(100, "Title must be between 1 and 100 characters");
const description = z
  .string()
  .min(1)
  .max(2000, "Description must be between 1 and 2000 characters");

/** What the author writes. The place is chosen once and never edited. */
export const updatePostInput = z.object({ title, description });

export const createPostInput = updatePostInput.extend({
  location: locationInput,
});

export type UpdatePostInput = z.infer<typeof updatePostInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
