"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";

const center = {
    lat: 51.532005,
    lng: -0.177331,
};
type Props = {
    selectedLocation: {
        address: string;
        lat: number;
        lng: number;
    } | null;
};

function MapSelector({ selectedLocation }: Props) {
    return (
        <GoogleMap
            mapContainerStyle={{
                width: "100%",
                height: "400px",
            }}
            center={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : center}
            zoom={16}
        >
            {selectedLocation && (
                <Marker
                    position={{
                        lat: selectedLocation.lat,
                        lng: selectedLocation.lng,
                    }}
                />
            )}
        </GoogleMap>
    );
}

export default MapSelector;
