"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { AuthGatedLink } from "@/features/auth";
import { MapView } from "./MapView";
import { MapSearchBar } from "./MapSearchBar";
import { LocationSheet } from "./LocationSheet";
import { useBottomSheet } from "../hooks/useBottomSheet";
import type { PlaceDetails } from "@/hooks/usePlacePredictions";
import type { LocationWithPosts } from "@/server/location/types";

/** Longitude ranges wrap at the antimeridian; latitude never does. */
function isWithin(
  location: LocationWithPosts,
  bounds: google.maps.LatLngBoundsLiteral,
) {
  const { north, south, east, west } = bounds;
  const inLatitude = location.latitude >= south && location.latitude <= north;
  const inLongitude =
    west <= east
      ? location.longitude >= west && location.longitude <= east
      : location.longitude >= west || location.longitude <= east;

  return inLatitude && inLongitude;
}

export function MapExplorer({
  locations,
  isAuthenticated,
}: {
  locations: LocationWithPosts[];
  isAuthenticated: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [selected, setSelected] = useState<LocationWithPosts | null>(null);
  const [focus, setFocus] = useState<PlaceDetails | null>(null);
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral | null>(
    null,
  );

  const sheet = useBottomSheet(viewportHeight);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setViewportHeight(entry.contentRect.height),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function selectLocation(location: LocationWithPosts) {
    setSelected(location);
    sheet.setSnap("half");
  }

  function handleSearch(place: PlaceDetails) {
    setFocus(place);
    // Searching for a place we already have posts for opens it directly.
    const match = locations.find((l) => l.placeId === place.placeId);
    if (match) selectLocation(match);
  }

  // Dragging the sheet down to peek means "I'm done with this place".
  const activeLocation = sheet.snap === "peek" ? null : selected;

  // What the map is actually showing right now — this is the "area".
  const visibleLocations = bounds
    ? locations.filter((location) => isWithin(location, bounds))
    : locations;

  const areaPostCount = visibleLocations.reduce(
    (total, location) => total + location.posts.length,
    0,
  );

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0">
        <MapView
          locations={locations}
          selected={activeLocation}
          onSelect={selectLocation}
          focus={focus}
          bottomInset={sheet.visibleHeight}
          onBoundsChange={setBounds}
        />
      </div>

      <MapSearchBar onSelect={handleSearch} />

      {/* Primary action, kept above the sheet and out of the way when it is open */}
      <AuthGatedLink
        href="/posts/create"
        isAuthenticated={isAuthenticated}
        aria-label="Create a post"
        style={{
          bottom: sheet.visibleHeight + 16,
          transition: sheet.isDragging
            ? "none"
            : "bottom 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms",
        }}
        className={`absolute right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent-hover ${
          sheet.snap === "full" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Plus className="h-6 w-6" />
      </AuthGatedLink>

      <LocationSheet
        location={activeLocation}
        isAuthenticated={isAuthenticated}
        areaLocations={visibleLocations}
        areaPostCount={areaPostCount}
        onSelectLocation={selectLocation}
        snap={sheet.snap}
        sheetHeight={sheet.sheetHeight}
        translate={sheet.translate}
        isDragging={sheet.isDragging}
        dragHandlers={sheet.dragHandlers}
      />
    </div>
  );
}
