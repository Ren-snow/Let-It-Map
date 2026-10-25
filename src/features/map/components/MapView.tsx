"use client";

import { useEffect, useRef } from "react";
import { Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import type { MapEvent } from "@vis.gl/react-google-maps";
import type { PlaceDetails } from "@/hooks/usePlacePredictions";
import type { LocationWithPosts } from "@/server/location/types";

const FALLBACK_CENTER = { lat: 20, lng: 0 };
const FALLBACK_ZOOM = 2;
const SINGLE_PIN_ZOOM = 14;
const SEARCH_ZOOM = 15;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

/**
 * Drives the camera from inside <Map>, where useMap() resolves the instance.
 * Renders nothing.
 */
function MapCamera({
  locations,
  selected,
  focus,
  bottomInset,
}: {
  locations: LocationWithPosts[];
  selected: LocationWithPosts | null;
  focus: PlaceDetails | null;
  bottomInset: number;
}) {
  const map = useMap();
  const core = useMapsLibrary("core");
  const hasFitted = useRef(false);

  // The sheet moves while dragging; read it without re-running the pan.
  const bottomInsetRef = useRef(bottomInset);
  useEffect(() => {
    bottomInsetRef.current = bottomInset;
  }, [bottomInset]);

  // Frame every pin on first load instead of a hardcoded city.
  useEffect(() => {
    if (!map || !core || hasFitted.current || locations.length === 0) return;
    hasFitted.current = true;

    if (locations.length === 1) {
      map.setCenter({ lat: locations[0].latitude, lng: locations[0].longitude });
      map.setZoom(SINGLE_PIN_ZOOM);
      return;
    }

    const bounds = new core.LatLngBounds();
    for (const location of locations) {
      bounds.extend({ lat: location.latitude, lng: location.longitude });
    }
    map.fitBounds(bounds, {
      top: 88,
      right: 32,
      bottom: bottomInsetRef.current + 24,
      left: 32,
    });
  }, [map, core, locations]);

  // Lift the selected pin above the sheet.
  useEffect(() => {
    if (!map || !selected) return;
    map.panTo({ lat: selected.latitude, lng: selected.longitude });
    map.panBy(0, bottomInsetRef.current / 2);
  }, [map, selected]);

  useEffect(() => {
    if (!map || !focus) return;
    map.panTo({ lat: focus.lat, lng: focus.lng });
    map.setZoom(SEARCH_ZOOM);
  }, [map, focus]);

  return null;
}

export function MapView({
  locations,
  selected,
  onSelect,
  focus,
  bottomInset,
  onBoundsChange,
}: {
  locations: LocationWithPosts[];
  selected: LocationWithPosts | null;
  onSelect: (location: LocationWithPosts) => void;
  focus: PlaceDetails | null;
  bottomInset: number;
  onBoundsChange: (bounds: google.maps.LatLngBoundsLiteral | null) => void;
}) {
  return (
    <Map
      defaultCenter={FALLBACK_CENTER}
      defaultZoom={FALLBACK_ZOOM}
      className="h-full w-full"
      gestureHandling="greedy"
      disableDefaultUI
      mapId={MAP_ID}
      // idle fires once the camera settles, so this does not run mid-gesture.
      onIdle={(e: MapEvent) => onBoundsChange(e.map.getBounds()?.toJSON() ?? null)}
    >
      <MapCamera
        locations={locations}
        selected={selected}
        focus={focus}
        bottomInset={bottomInset}
      />

      {locations.map((location) => (
        <AdvancedMarker
          key={location.id}
          position={{ lat: location.latitude, lng: location.longitude }}
          onClick={() => onSelect(location)}
        >
          <Pin
            background={selected?.id === location.id ? "#1B7A6E" : "#C1623A"}
            borderColor={selected?.id === location.id ? "#15665C" : "#8B3A1F"}
            glyphColor="#FFF"
          />
        </AdvancedMarker>
      ))}
    </Map>
  );
}
