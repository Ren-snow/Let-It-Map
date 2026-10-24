import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { posts, locations } from "@/server/db/schema";
import type { CreatePostInput } from "@/server/schema/post";

/**
 * Creates a post, reusing the location row when the place is already known.
 * Input is expected to be validated by the caller.
 */
export async function createPost(
  userId: string,
  input: CreatePostInput,
): Promise<{ id: string }> {
  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: locations.id })
      .from(locations)
      .where(eq(locations.placeId, input.location.placeId))
      .limit(1);

    let locationId: string;

    if (existing.length > 0) {
      locationId = existing[0].id;
    } else {
      const [location] = await tx
        .insert(locations)
        .values({
          placeId: input.location.placeId,
          name: input.location.name,
          address: input.location.address || input.location.name,
          latitude: String(input.location.latitude),
          longitude: String(input.location.longitude),
        })
        .returning({ id: locations.id });
      locationId = location.id;
    }

    const [post] = await tx
      .insert(posts)
      .values({
        userId,
        locationId,
        title: input.title,
        description: input.description,
      })
      .returning({ id: posts.id });

    return { id: post.id };
  });
}
