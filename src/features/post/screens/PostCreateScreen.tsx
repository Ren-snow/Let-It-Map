import { CreatePostForm } from "../components/CreatePostForm";
import { MapProvider } from "@/features/map";
import type { PlaceDetails } from "@/hooks/usePlacePredictions";

export type PostCreateScreenProps = {
  searchParams: Promise<PlaceParams>;
};

type PlaceParams = {
  placeId?: string;
  name?: string;
  address?: string;
  lat?: string;
  lng?: string;
};

/** "Post here" on the map sheet arrives with the place already chosen. */
function readPlace(params: PlaceParams): PlaceDetails | null {
  const { placeId, name, address, lat, lng } = params;
  if (!placeId || !name || !lat || !lng) return null;

  const latitude = Number(lat);
  const longitude = Number(lng);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

  return { placeId, name, address: address ?? "", lat: latitude, lng: longitude };
}

export async function PostCreateScreen({ searchParams }: PostCreateScreenProps) {
  const initialPlace = readPlace(await searchParams);

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl tracking-tight">Create a Post</h1>
        <p className="mt-2 text-sm text-muted">
          Share a place that matters to you
        </p>
      </div>
      <MapProvider>
        <CreatePostForm initialPlace={initialPlace} />
      </MapProvider>
    </div>
  );
}
