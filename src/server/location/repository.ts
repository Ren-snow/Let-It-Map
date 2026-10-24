import { eq } from "drizzle-orm";
import { locations } from "@/server/db/schema";
import type { DbClient } from "@/server/transaction";
import type { LocationInput } from "@/server/schema/location";

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
