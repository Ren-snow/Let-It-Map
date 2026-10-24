/**
 * Seeds development data. Safe to run repeatedly: it removes the rows it
 * created last time (users on the seed domain, and the seeded locations) and
 * leaves anything you made through the app alone.
 *
 *   npm run db:seed
 *
 * Place IDs are resolved through the Places API when a key is available, so
 * seeded pins match what the in-app search returns. Without a key the seeder
 * falls back to synthetic IDs and still produces a usable map.
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { inArray, like } from "drizzle-orm";
import postgres from "postgres";

import * as schema from "../src/server/db/schema";
import {
  SEED_PLACES,
  SEED_POSTS,
  SEED_USERS,
  type SeedPlace,
} from "./seed-data";

config({ path: ".env.local" });

const SEED_EMAIL_DOMAIN = "@seed.local";
const DAY_MS = 24 * 60 * 60 * 1000;

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DIRECT_URL or DATABASE_URL must be set in .env.local");
}

const client = postgres(connectionString, { prepare: false, max: 1 });
const db = drizzle(client, { schema });

const apiKey =
  process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** A stable stand-in used when the Places API is unavailable. */
function fallbackPlaceId(place: SeedPlace) {
  return `seed:${place.slug}`;
}

async function resolvePlace(place: SeedPlace): Promise<SeedPlace & { placeId: string }> {
  if (!apiKey) return { ...place, placeId: fallbackPlaceId(place) };

  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", place.query);
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url);
    const body = await response.json();
    const match = body?.results?.[0];

    if (body?.status !== "OK" || !match?.place_id) {
      console.warn(`  ! ${place.name}: Places API said ${body?.status ?? response.status}`);
      return { ...place, placeId: fallbackPlaceId(place) };
    }

    return {
      ...place,
      placeId: match.place_id,
      name: match.name ?? place.name,
      address: match.formatted_address ?? place.address,
      latitude: match.geometry?.location?.lat ?? place.latitude,
      longitude: match.geometry?.location?.lng ?? place.longitude,
    };
  } catch (error) {
    console.warn(`  ! ${place.name}: lookup failed (${(error as Error).message})`);
    return { ...place, placeId: fallbackPlaceId(place) };
  }
}

async function clearPreviousSeed(placeIds: string[]) {
  // Deleting the users cascades to their posts.
  const deletedUsers = await db
    .delete(schema.users)
    .where(like(schema.users.email, `%${SEED_EMAIL_DOMAIN}`))
    .returning({ id: schema.users.id });

  // Both the resolved IDs and the synthetic ones, so a run that switches
  // between them does not leave orphans behind.
  const seedPlaceIds = [...placeIds, ...SEED_PLACES.map(fallbackPlaceId)];
  const candidates = await db
    .select({ id: schema.locations.id })
    .from(schema.locations)
    .where(inArray(schema.locations.placeId, seedPlaceIds));

  // A seeded place may also hold posts written through the app. Deleting the
  // location would cascade into those, so keep any location still in use.
  const stillUsed = new Set(
    candidates.length === 0
      ? []
      : (
          await db
            .select({ locationId: schema.posts.locationId })
            .from(schema.posts)
            .where(
              inArray(
                schema.posts.locationId,
                candidates.map((location) => location.id),
              ),
            )
        ).map((row) => row.locationId),
  );

  const removable = candidates
    .map((location) => location.id)
    .filter((id) => !stillUsed.has(id));

  if (removable.length > 0) {
    await db.delete(schema.locations).where(inArray(schema.locations.id, removable));
  }

  return { users: deletedUsers.length, locations: removable.length };
}

async function main() {
  console.log(
    apiKey
      ? "Resolving places through the Places API..."
      : "No Maps API key found — using synthetic place IDs.",
  );
  const places = await Promise.all(SEED_PLACES.map(resolvePlace));
  const resolvedCount = places.filter(
    (p) => !p.placeId.startsWith("seed:"),
  ).length;
  console.log(`  ${resolvedCount}/${places.length} resolved to real place IDs`);

  const removed = await clearPreviousSeed(places.map((p) => p.placeId));
  if (removed.users || removed.locations) {
    console.log(
      `Removed previous seed: ${removed.users} users, ${removed.locations} locations`,
    );
  }

  const insertedUsers = await db
    .insert(schema.users)
    .values(
      SEED_USERS.map((user) => ({
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: new Date(),
      })),
    )
    .returning({ id: schema.users.id, email: schema.users.email });

  const userIdBySlug = new Map(
    SEED_USERS.map((user) => [
      user.slug,
      insertedUsers.find((row) => row.email === user.email)!.id,
    ]),
  );

  await db
    .insert(schema.locations)
    .values(
      places.map((place) => ({
        placeId: place.placeId,
        name: place.name,
        address: place.address,
        latitude: String(place.latitude),
        longitude: String(place.longitude),
      })),
    )
    // A place kept back by clearPreviousSeed is reused rather than duplicated.
    .onConflictDoNothing({ target: schema.locations.placeId });

  const locationRows = await db
    .select({ id: schema.locations.id, placeId: schema.locations.placeId })
    .from(schema.locations)
    .where(
      inArray(
        schema.locations.placeId,
        places.map((place) => place.placeId),
      ),
    );

  const locationIdBySlug = new Map(
    places.map((place) => [
      place.slug,
      locationRows.find((row) => row.placeId === place.placeId)!.id,
    ]),
  );

  const now = Date.now();
  await db.insert(schema.posts).values(
    SEED_POSTS.map((post) => {
      const createdAt = new Date(now - post.daysAgo * DAY_MS);
      return {
        userId: userIdBySlug.get(post.author)!,
        locationId: locationIdBySlug.get(post.place)!,
        title: post.title,
        description: post.description,
        createdAt,
        updatedAt: createdAt,
      };
    }),
  );

  console.log(
    `Seeded ${insertedUsers.length} users, ${locationRows.length} locations, ${SEED_POSTS.length} posts.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.end());
