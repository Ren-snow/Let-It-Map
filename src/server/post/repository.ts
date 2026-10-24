import { count, desc, eq } from "drizzle-orm";
import { locations, posts, users } from "@/server/db/schema";
import type { DbClient } from "@/server/transaction";
import type { PostDetail, PostWithDetails } from "./types";

const listColumns = {
  id: posts.id,
  title: posts.title,
  description: posts.description,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
  userId: users.id,
  userName: users.name,
  userImage: users.image,
  locationName: locations.name,
  locationAddress: locations.address,
};

type ListRow = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userName: string | null;
  userImage: string | null;
  locationName: string;
  locationAddress: string;
};

function toPostWithDetails(row: ListRow): PostWithDetails {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    user: { id: row.userId, name: row.userName, image: row.userImage },
    location: { name: row.locationName, address: row.locationAddress },
  };
}

export async function findMany(
  dbc: DbClient,
  params: { limit: number; offset: number; userId?: string },
): Promise<PostWithDetails[]> {
  const rows = await dbc
    .select(listColumns)
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .innerJoin(locations, eq(posts.locationId, locations.id))
    .where(params.userId ? eq(posts.userId, params.userId) : undefined)
    .orderBy(desc(posts.createdAt))
    .limit(params.limit)
    .offset(params.offset);

  return rows.map(toPostWithDetails);
}

export async function countAll(
  dbc: DbClient,
  params: { userId?: string },
): Promise<number> {
  const [row] = await dbc
    .select({ total: count() })
    .from(posts)
    .where(params.userId ? eq(posts.userId, params.userId) : undefined);

  return row.total;
}

export async function findById(
  dbc: DbClient,
  id: string,
): Promise<PostDetail | null> {
  const [row] = await dbc
    .select({
      ...listColumns,
      locationId: locations.id,
      placeId: locations.placeId,
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
    ...toPostWithDetails(row),
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

export async function insert(
  dbc: DbClient,
  values: {
    userId: string;
    locationId: string;
    title: string;
    description: string;
  },
): Promise<{ id: string }> {
  const [row] = await dbc
    .insert(posts)
    .values(values)
    .returning({ id: posts.id });

  return { id: row.id };
}
