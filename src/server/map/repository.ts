import { eq } from "drizzle-orm";
import { locations, posts, users } from "@/server/db/schema";
import type { DbClient } from "@/server/transaction";
import type { MapLocation } from "./types";

/**
 * Every location that has at least one post, with those posts attached.
 * The join returns one row per post, so the rows are folded into locations here.
 */
export async function findAllWithPosts(dbc: DbClient): Promise<MapLocation[]> {
  const rows = await dbc
    .select({
      locationId: locations.id,
      placeId: locations.placeId,
      locationName: locations.name,
      latitude: locations.latitude,
      longitude: locations.longitude,
      address: locations.address,
      postId: posts.id,
      postTitle: posts.title,
      userName: users.name,
    })
    .from(locations)
    .innerJoin(posts, eq(locations.id, posts.locationId))
    .innerJoin(users, eq(posts.userId, users.id));

  const byLocation = new Map<string, MapLocation>();

  for (const row of rows) {
    const post = {
      id: row.postId,
      title: row.postTitle,
      userName: row.userName,
    };
    const existing = byLocation.get(row.locationId);

    if (existing) {
      existing.posts.push(post);
      continue;
    }

    byLocation.set(row.locationId, {
      id: row.locationId,
      placeId: row.placeId,
      name: row.locationName,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      address: row.address,
      posts: [post],
    });
  }

  return Array.from(byLocation.values());
}
