import { eq, desc, count } from "drizzle-orm";
import { db } from "@/server/db";
import { posts, locations, users } from "@/server/db/schema";
import type { PostDetail, PostWithDetails } from "@/server/post/types";
import type { PaginatedResult } from "@/types/common";

export async function getPaginatedPosts({
  page = 1,
  pageSize = 20,
  userId,
}: {
  page?: number;
  pageSize?: number;
  userId?: string;
}): Promise<PaginatedResult<PostWithDetails>> {
  const whereCondition = userId ? eq(posts.userId, userId) : undefined;

  // db.select() always returns an array; destructure to get rows and the first count result
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        userName: users.name,
        userId: users.id,
        userImage: users.image,
        locationName: locations.name,
        locationAddress: locations.address,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .innerJoin(locations, eq(posts.locationId, locations.id))
      .where(whereCondition)
      .orderBy(desc(posts.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: count() }).from(posts).where(whereCondition),
  ]);

  return {
    data: rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      user: {
        id: row.userId,
        name: row.userName,
        image: row.userImage,
      },
      location: {
        name: row.locationName,
        address: row.locationAddress,
      },
    })),
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  };
}

/** Postgres rejects a malformed uuid outright, so screen it before querying. */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPostById(id: string): Promise<PostDetail | null> {
  if (!UUID_PATTERN.test(id)) return null;

  const [row] = await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      userId: users.id,
      userName: users.name,
      userImage: users.image,
      locationId: locations.id,
      placeId: locations.placeId,
      locationName: locations.name,
      locationAddress: locations.address,
      latitude: locations.latitude,
      longitude: locations.longitude,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .innerJoin(locations, eq(posts.locationId, locations.id))
    .where(eq(posts.id, id))
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    user: {
      id: row.userId,
      name: row.userName,
      image: row.userImage,
    },
    location: {
      id: row.locationId,
      placeId: row.placeId,
      name: row.locationName,
      address: row.locationAddress,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
    },
  };
}
