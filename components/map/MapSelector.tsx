"use client";

import { GoogleMap, LoadScript } from "@react-google-maps/api";

const center = {
    lat: 51.532005,
    lng: -0.177331,
};

function MapSelector() {
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            libraries={["places"]}
        >
            <GoogleMap
                mapContainerStyle={{
                    width: "100%",
                    height: "400px", // 好きな高さ
                }}
                center={center}
                zoom={16}
            ></GoogleMap>
        </LoadScript>
    );
}

export default MapSelector;
