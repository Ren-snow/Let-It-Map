import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMapEvents,
} from "react-leaflet";

function MapSelector() {
    function LocationMarker() {
        const [position, setPosition] = useState<LatLng | null>(null);
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                console.log(e.latlng);
            },
        });

        const customMarker = () => {
            return L.icon({
                iconUrl: "/custom-map-marker.svg",
                iconSize: [35, 35],
                iconAnchor: [20, 40], 
                popupAnchor: [0, -40],
            });
        };

        return position === null ? null : (
            <Marker position={position} icon={customMarker()}>
                <Popup>Pinned point</Popup>
            </Marker>
        );
    }

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-80"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    );
}

export default MapSelector;
