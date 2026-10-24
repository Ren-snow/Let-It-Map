import { getMapLocations } from "@/server/map/queries";
import { MapProvider } from "../components/MapProvider";
import { MapExplorer } from "../components/MapExplorer";

/**
 * Launch screen. The map is the background layer; everything else floats on it.
 */
export async function MapScreen() {
  const locations = await getMapLocations();

  return (
    <div className="h-[var(--app-height)] w-full">
      <MapProvider>
        <MapExplorer locations={locations} />
      </MapProvider>
    </div>
  );
}
