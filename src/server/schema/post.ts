import { z } from "zod";
import { locationInput } from "@/server/schema/location";

const title = z.string().min(1).max(100, "Title must be between 1 and 100 characters");
const description = z
  .string()
  .min(1)
  .max(2000, "Description must be between 1 and 2000 characters");

export const createPostInput = z.object({
  title,
  description,
  location: locationInput,
});

export type CreatePostInput = z.infer<typeof createPostInput>;
