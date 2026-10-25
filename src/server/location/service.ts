import { dbClient, type DbClient } from "@/server/transaction";
import type { LocationInput } from "@/server/schema/location";
import type { LocationWithPosts } from "./types";
import * as locationRepo from "./repository";

/**
 * A place is stored once. Two posts about Abbey Road share one location row,
 * which is what lets the map group them under a single pin.
 */
export async function findOrCreate(
  dbc: DbClient,
  input: LocationInput,
): Promise<string> {
  const existing = await locationRepo.findIdByPlaceId(dbc, input.placeId);
  return existing ?? locationRepo.insert(dbc, input);
}

/**
 * Pins for the map screen. There is no rule to apply yet — when one arrives
 * (hiding drafts, respecting a block list) it belongs here, not in the query.
 */
export async function listPins(): Promise<LocationWithPosts[]> {
  return locationRepo.findAllWithPosts(dbClient);
}
