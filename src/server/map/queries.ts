import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { locations, posts, users } from "@/server/db/schema";
import type { MapLocation } from "@/server/map/types";

export async function getMapLocations(): Promise<MapLocation[]> {
  const rows = await db
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

  const locationMap = new Map<string, MapLocation>();

  for (const row of rows) {
    const existing = locationMap.get(row.locationId);

    if (existing) {
      existing.posts.push({
        id: row.postId,
        title: row.postTitle,
        userName: row.userName,
      });
    } else {
      locationMap.set(row.locationId, {
        id: row.locationId,
        placeId: row.placeId,
        name: row.locationName,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        address: row.address,
        posts: [
          {
            id: row.postId,
            title: row.postTitle,
            userName: row.userName,
          },
        ],
      });
    }
  }

  return Array.from(locationMap.values());
}
