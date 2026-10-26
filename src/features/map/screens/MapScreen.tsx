import { auth } from "@/lib/auth";
import * as locationService from "@/server/location/service";
import { MapProvider } from "../components/MapProvider";
import { MapExplorer } from "../components/MapExplorer";

/**
 * Launch screen. The map is the background layer; everything else floats on it.
 */
export async function MapScreen() {
  const [locations, session] = await Promise.all([
    locationService.listPins(),
    auth(),
  ]);

  return (
    <div className="h-[var(--app-height)] w-full">
      <MapProvider>
        <MapExplorer locations={locations} isAuthenticated={!!session?.user} />
      </MapProvider>
    </div>
  );
}
