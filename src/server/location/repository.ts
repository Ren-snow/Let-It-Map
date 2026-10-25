import { eq } from "drizzle-orm";
import { locations, posts, users } from "@/server/db/schema";
import type { DbClient } from "@/server/transaction";
import type { LocationInput } from "@/server/schema/location";
import type { LocationWithPosts } from "./types";

export async function findIdByPlaceId(
  dbc: DbClient,
  placeId: string,
): Promise<string | null> {
  const [row] = await dbc
    .select({ id: locations.id })
    .from(locations)
    .where(eq(locations.placeId, placeId))
    .limit(1);

  return row?.id ?? null;
}

export async function insert(
  dbc: DbClient,
  input: LocationInput,
): Promise<string> {
  const [row] = await dbc
    .insert(locations)
    .values({
      placeId: input.placeId,
      name: input.name,
      address: input.address || input.name,
      latitude: String(input.latitude),
      longitude: String(input.longitude),
    })
    .returning({ id: locations.id });

  return row.id;
}

export async function findAllWithPosts(dbc: DbClient): Promise<LocationWithPosts[]> {
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

  const byLocation = new Map<string, LocationWithPosts>();

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
