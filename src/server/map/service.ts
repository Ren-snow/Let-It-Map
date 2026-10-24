import { dbClient } from "@/server/transaction";
import * as mapRepo from "./repository";
import type { MapLocation } from "./types";

/**
 * Pins for the map screen. There is no rule to apply yet — when one arrives
 * (hiding drafts, respecting a block list) it belongs here, not in the query.
 */
export async function listPins(): Promise<MapLocation[]> {
  return mapRepo.findAllWithPosts(dbClient);
}
