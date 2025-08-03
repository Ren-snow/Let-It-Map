import { Marker } from "@react-google-maps/api";
import BaseMap from "./BaseMap";

type Props = {
  selectedLocation: {
    address: string;
    lat: number;
    lng: number;
  } | null;
};

const fallbackCenter = {
  lat: 51.532005,
  lng: -0.177331,
};

function MapSelector({ selectedLocation }: Props) {
  const center = selectedLocation
    ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
    : fallbackCenter;

  return (
    <BaseMap center={center} zoom={16}>
      {selectedLocation && (
        <Marker position={center} />
      )}
    </BaseMap>
  );
}

export default MapSelector;
