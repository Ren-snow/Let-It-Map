import { z } from "zod";

/**
 * A location chosen through Google Places.
 * Latitude/longitude arrive as strings from a form and are coerced here.
 */
export const locationInput = z.object({
  placeId: z.string().min(1, "Please select a location from the suggestions"),
  name: z.string().min(1, "Location name is required"),
  address: z.string(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export type LocationInput = z.infer<typeof locationInput>;
